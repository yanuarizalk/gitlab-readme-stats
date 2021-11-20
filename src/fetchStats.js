const { request } = require("./utils");
const retryer = require("./retryer");
const calculateRank = require("./calculateRank");
require("dotenv").config();

const fetcher = (variables, token) => {
  return request(
    {
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
      variables,
    },
    {
      Authorization: `bearer ${token || process.env.GITLAB_TOKEN}`,
    }
  );
};

async function fetchStats(username) {
  if (!username) throw Error("Invalid username");

  const stats = {
    name: "",
    authoredMergeRequests: 0,
    projectMemberships: 0,
    groupMemeberships: 0,
    assignedMergeRequests: 0,
    todos: 0,
    rank: { level: "C", score: 0 },
  };

  let res = await retryer(fetcher, { username });

  if (res.data.errors) {
    console.log(res.data.errors);
    throw Error(res.data.errors[0].message || "Could not fetch user");
  }

  const user = res.data.data.user;

  stats.name = user.name || user.username;
  stats.totalMRs =
    user.authoredMergeRequests.count + user.assignedMergeRequests.count;
  stats.totalProjects = user.projectMemberships.nodes.length;
  stats.totalGroups = user.groupMemberships.nodes.length;
  stats.totalTodos = user.todos.nodes.length;

  stats.rank = calculateRank({
    mrs: stats.totalMRs,
  });

  return stats;
}

module.exports = fetchStats;
