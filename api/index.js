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
            authoredMergeRequests(first: 100) {
              nodes {
                project {
                  name
                }
              }
            }
            reviewRequestedMergeRequests(first: 100) {
              nodes {
                project {
                  id
                }
              }
            }
            status {
              message
              emoji
            }
          }
        }
      `,
        variables: {
            username: username,
        },
        },
    });

    const stats = { authoredMergeRequests: 0, name: "", reviewRequestedMergeRequests: 0 };
    if (res.data.error) return stats;

    console.log(res)

    const user = res.data.data.user;
    stats.authoredMergeRequests = user.authoredMergeRequests.nodes.length;
    stats.reviewRequestedMergeRequests = user.reviewRequestedMergeRequests.nodes.length;
    stats.name = user.name;
    return stats;
}

module.exports = async (req, res) => {
    const username = req.query.username;
    let { name, authoredMergeRequests, reviewRequestedMergeRequests } = await fetchStats(
        username
    );

    res.setHeader("Content-Type", "image/svg+xml");
    res.send(`
    <svg width="495" height="130" viewBox="0 0 495 130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
    .header { font: 600 18px 'Segoe UI'; fill: #2F80ED }
    .stat { font: 600 14px 'Segoe UI'; fill: #333 }
    .bold { font-weight: 700 }
    </style>
    <rect x="0.5" y="0.5" width="494" height="99%" rx="4.5" fill="#FFFEFE" stroke="#E4E2E2"/>
    <text x="25" y="35" class="header">${name}'s GitLab's stats</text>
    <text x="25" y="70" class="stat bold">Total Authored Merge Requests:</text>
    <text x="135" y="70" class="stat">${authoredMergeRequests}</text>
    <text x="25" y="90" class="stat bold">Total Review Requested Merge Requests:</text>
    <text x="135" y="90" class="stat">${reviewRequestedMergeRequests}</text>
    </svg>
  `);
};
