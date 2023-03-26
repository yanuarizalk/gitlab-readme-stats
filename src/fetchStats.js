const { request } = require("./utils");
const retryer = require("./retryer");
const calculateRank = require("./calculateRank");
require("dotenv").config();

const fetcher = (variables, token) => {
  let { username, remote_username } = variables;
  // remote fetches only have remote_username set
  if (remote_username && !username) {
    username = remote_username;
  }

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
      variables: { username },
      gitlab_url: variables.remote_gitlab,
    },
    {
      Authorization: `bearer ${token || process.env.GITLAB_TOKEN}`,
    }
  );
};

async function getInstanceStats(res) {
  const user = res.data.data.user;

  return {
    name: "",
    authoredMergeRequests: 0,
    projectMemberships: 0,
    groupMemeberships: 0,
    assignedMergeRequests: 0,
    todos: 0,
    rank: { level: "C", score: 0 },
    name: user.name || user.username,
    totalMRs:
      user.authoredMergeRequests.count + user.assignedMergeRequests.count,
    totalProjects: user.projectMemberships.nodes.length,
    totalGroups: user.groupMemberships.nodes.length,
    totalTodos: user.todos.nodes.length,
  };
}

// check for valid combinations of data configuration parameters
function validateUrlParameters(statsParameters) {
  const {
    username,
    remote_gitlab,
    combine_remote_and_public,
    remote_username,
  } = statsParameters;

  // Validate public route
  if (!username && !remote_username) {
    throw Error(
      "Pass in valid username or remote_username and remote_gitlab in url parameters"
    );
  }

  // Validate private route
  if (remote_gitlab && !remote_username) {
    throw Error("Detected remote_gitlab, but remote_username not set");
  }

  if (!remote_gitlab && remote_username) {
    throw Error("Detected remote_username, but remote_gitlab not set");
  }

  // Validate combined route
  if (
    combine_remote_and_public &&
    (!remote_username || !remote_gitlab || !username)
  ) {
    throw Error(
      "To use combine_remote_and_public make sure remote_username, remote_gitlab, and username"
    );
  }

  if (!combine_remote_and_public && remote_username && username) {
    throw Error(
      "Detected username and remote_username set but combine_remote_and_public not set"
    );
  }
}

function normalizeUrlParameters(statsParameters) {
  let { username, remote_gitlab, combine_remote_and_public, remote_username } =
    statsParameters;

  if (remote_gitlab) {
    remote_gitlab = remote_gitlab.toLowerCase();

    // assume if not passed in, user meant to use https
    if (
      !remote_gitlab.includes("http://") ||
      !remote_gitlab.includes("https://")
    )
      remote_gitlab = `https://${remote_gitlab}`;

    if (!remote_gitlab.endsWith("/api/graphql"))
      remote_gitlab = `${remote_gitlab}/api/graphql`;
  }

  return {
    username,
    remote_gitlab,
    combine_remote_and_public,
    remote_username,
  };
}

async function fetchStats(statsParameters) {
  validateUrlParameters(statsParameters);

  const {
    username,
    remote_gitlab,
    combine_remote_and_public,
    remote_username,
  } = normalizeUrlParameters(statsParameters);

  let remoteResponse;
  let res;
  let stats = {};
  let remoteVariables = {
    remote_username,
    remote_gitlab,
    combine_remote_and_public,
  };

  if (combine_remote_and_public) {
    // remoteResponse = retryer(fetcher, remoteVariables);
    // res = retryer(fetcher, { username });
    [res, remoteResponse] = await Promise.all([
      retryer(fetcher, { username }),
      retryer(fetcher, remoteVariables),
    ]);
  } else if (remote_gitlab) {
    res = await retryer(fetcher, remoteVariables);
  } else {
    res = await retryer(fetcher, { username });
  }

  if (res?.data?.errors) {
    console.log(res.data.errors);
    throw Error(
      res.data.errors[0].message || "Could not fetch user from gitlab.org"
    );
  }

  if (remoteResponse?.data?.errors) {
    // Only specifies if its a remote user if we are doing a combined result fetch
    console.log(res.data.errors);
    throw Error(
      res.data.errors[0].message || `Could not fetch user from ${remote_gitlab}`
    );
  }

  if (combine_remote_and_public) {
    const [remoteStats, publicGitlabStats] = await Promise.all([
      getInstanceStats(remoteResponse),
      getInstanceStats(res),
    ]);

    stats.name = publicGitlabStats.name; // TODO: create parameter to allow user to pick display name source
    stats.rank = publicGitlabStats.rank;
    stats.totalMRs = remoteStats.totalMRs + publicGitlabStats.totalMRs;
    stats.totalProjects =
      remoteStats.totalProjects + publicGitlabStats.totalProjects;
    stats.totalGroups = remoteStats.totalGroups + publicGitlabStats.totalGroups;
    stats.todos = remoteStats.todos + publicGitlabStats.todos;
    stats.totalTodos = remoteStats.totalTodos + publicGitlabStats.totalTodos;
    stats.authoredMergeRequests =
      remoteStats.authoredMergeRequests +
      publicGitlabStats.authoredMergeRequests;
    stats.projectMemberships =
      remoteStats.projectMemberships + publicGitlabStats.projectMemberships;
    stats.groupMemeberships =
      remoteStats.groupMemeberships + publicGitlabStats.groupMemeberships;
    stats.assignedMergeRequests =
      remoteStats.assignedMergeRequests +
      publicGitlabStats.assignedMergeRequests;
  } else {
    // non combined remote and public gitlab will route here
    stats = await getInstanceStats(res);
  }

  if (JSON.stringify(stats) === "{}") {
    throw Error(`Error generating stats`);
  }

  stats.rank = calculateRank({
    mrs: stats.totalMRs,
  });

  return stats;
}

module.exports = fetchStats;
