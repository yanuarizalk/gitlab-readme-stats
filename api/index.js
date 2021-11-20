const axios = require("axios");
require("dotenv").config();

async function fetchStats(username) {
  const res = await axios({
    url: "https://gitlab.com/api/graphql",
    method: "post",
    headers: {
      Authorization: `bearer ${process.env.GITLAB_TOKEN}`,
    },
    data: {
      query: `
        query userInfo($username: String!) {
          user(username: $username) {
            name
            authoredMergeRequests {
              count
            }
            assignedMergeRequests {
              count
            }
            projectMemberships {
              nodes {
                id
              }
            }
            groupMemberships {
              nodes {
                id
              }
            }
            todos {
              nodes {
                id
              }
            }
          }
        }
      `,
      variables: {
        username: username,
      },
    },
  });

  const stats = {
    name: "",
    authoredMergeRequests: 0,
    projectMemberships: 0,
    groupMemeberships: 0,
    assignedMergeRequests: 0,
    todos: 0,
  };

  if (res.data.error) return stats;

  const user = res.data.data.user;

  stats.name = user.name;
  stats.totalMrs =
    user.authoredMergeRequests.count + user.assignedMergeRequests.count;
  stats.totalProjects = user.projectMemberships.nodes.length;
  stats.totalGroups = user.groupMemberships.nodes.length;
  stats.todos = user.todos.nodes.length;

  return stats;
}

const createTextNode = (icon, label, value, lheight) => {
  return `
    <tspan x="25" dy="${lheight}" class="stat bold">
    <tspan class="icon ${
      icon === "★" && "star-icon"
    }" fill="#4C71F2">${icon}</tspan> ${label}:</tspan>
    <tspan x="155" dy="0" class="stat">${value}</tspan>
  `;
};

const renderSVG = (stats, options) => {
  const { name, totalProjects, totalGroups, totalMrs, totalTodos } = stats;
  const { hide, show_icons, hide_border, line_height } = options || {};

  const lheight = line_height || 25;

  const STAT_MAP = {
    projects: createTextNode("★", "Total Projects", totalProjects, lheight),
    groups: createTextNode("🕗", "Total Groups", totalGroups, lheight),
    mrs: createTextNode("🔀", "Total MRs ", totalMrs, lheight),
    // assignedMrs: createTextNode(
    //   "ⓘ",
    //   "Total Assigned MRs",
    //   totalAssignedMergeRequests,
    //   lheight
    // ),
    todos: createTextNode("📕", "Todos", totalTodos, lheight),
  };

  const statItems = Object.keys(STAT_MAP)
    .filter((key) => !hide.includes(key))
    .map((key) => STAT_MAP[key]);

  const height = 45 + (statItems.length + 1) * lheight;

  return `
    <svg width="495" height="${height}" viewBox="0 0 495 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
      .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2F80ED }
      .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #333 }
      .star-icon { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; }
      .bold { font-weight: 700 }
      .icon {
        display: none;
        ${!!show_icons && "display: block"}
      }
      </style>
      ${
        !hide_border &&
        `<rect x="0.5" y="0.5" width="494" height="99%" rx="4.5" fill="#FFFEFE" stroke="#E4E2E2"/>`
      }
     
      <text x="25" y="35" class="header">${name}'s GitLab Stats</text>
      <text y="45">
        ${statItems}
      </text>
    </svg>
  `;
};

module.exports = async (req, res) => {
  const username = req.query.username;
  const hide = req.query.hide;
  const hide_border = req.query.hide_border;
  const show_icons = req.query.show_icons;
  const line_height = req.query.line_height;

  const stats = await fetchStats(username);

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(
    renderSVG(stats, {
      hide: JSON.parse(hide || "[]"),
      show_icons,
      hide_border,
      line_height,
    })
  );
};
