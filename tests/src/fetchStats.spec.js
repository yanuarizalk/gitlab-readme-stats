require("@testing-library/jest-dom");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const fetchStats = require("../../src/fetchStats");
const calculateRank = require("../../src/calculateRank");

const data = {
  data: {
    user: {
      name: "David O'Regan",
      authoredMergeRequests: { count: 100 },
      assignedMergeRequests: { count: 0 },
      projectMemberships: { nodes: [] },
      groupMemberships: { nodes: [] },
      todos: { nodes: [] },
    },
  },
};

const error = {
  errors: [
    {
      type: "NOT_FOUND",
      path: ["user"],
      locations: [],
      message: "Could not resolve to a User with the username of 'noname'.",
    },
  ],
};

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

describe("Test fetchStats", () => {
  it("should fetch correct stats for public gitlab", async () => {
    mock.onPost("https://gitlab.com/api/graphql").reply(200, data);

    let stats = await fetchStats({ username: "oregand" });
    const rank = calculateRank({
      mrs: 100,
    });

    expect(stats).toStrictEqual({
      name: "David O'Regan",
      assignedMergeRequests: 0,
      authoredMergeRequests: 0,
      groupMemeberships: 0,
      projectMemberships: 0,
      todos: 0,
      totalGroups: 0,
      totalMRs: 100,
      totalProjects: 0,
      totalTodos: 0,
      rank,
    });
  });

  it("should fetch correct stats for private gitlab", async () => {
    mock.onPost("https://gitlab.madeupdomain.com/api/graphql").reply(200, data);

    let stats = await fetchStats({
      remote_username: "oregand",
      remote_gitlab: "gitlab.madeupdomain.com",
    });
    const rank = calculateRank({
      mrs: 100,
    });

    expect(stats).toStrictEqual({
      name: "David O'Regan",
      assignedMergeRequests: 0,
      authoredMergeRequests: 0,
      groupMemeberships: 0,
      projectMemberships: 0,
      todos: 0,
      totalGroups: 0,
      totalMRs: 100,
      totalProjects: 0,
      totalTodos: 0,
      rank,
    });
  });

  it("should fetch correct stats for combined public and remote gitlab", async () => {
    mock.onPost("https://gitlab.madeupdomain.com/api/graphql").reply(200, data);
    mock.onPost("https://gitlab.com/api/graphql").reply(200, data);

    let stats = await fetchStats({
      remote_username: "oregand",
      remote_gitlab: "gitlab.madeupdomain.com",
      username: "oregand",
      combine_remote_and_public: "true",
    });

    const rank = calculateRank({
      mrs: 200,
    });

    expect(stats).toStrictEqual({
      name: "David O'Regan",
      assignedMergeRequests: 0,
      authoredMergeRequests: 0,
      groupMemeberships: 0,
      projectMemberships: 0,
      todos: 0,
      totalGroups: 0,
      totalMRs: 200,
      totalProjects: 0,
      totalTodos: 0,
      rank,
    });
  });

  it("should throw error", async () => {
    mock.onPost("https://gitlab.com/api/graphql").reply(200, error);

    await expect(fetchStats({ username: "anuraghazra" })).rejects.toThrow(
      "Could not resolve to a User with the username of 'noname'."
    );
  });

  it("should throw errors on invalid inputs", async () => {
    mock.onPost("https://gitlab.com/api/graphql").reply(200, error);

    await expect(fetchStats({})).rejects.toThrow(
      "Pass in valid username or remote_username and remote_gitlab in url parameters"
    );

    await expect(
      fetchStats({ remote_gitlab: "gitlab.madeupdomain.com", username: "blah" })
    ).rejects.toThrow("Detected remote_gitlab, but remote_username not set");

    await expect(fetchStats({ remote_username: "fakey" })).rejects.toThrow(
      "Detected remote_username, but remote_gitlab not set"
    );

    await expect(
      fetchStats({
        remote_username: "fakey",
        remote_gitlab: "gitlab.madeupdomain.com",
        username: "blah",
      })
    ).rejects.toThrow(
      "Detected username and remote_username set but combine_remote_and_public not set"
    );
  });
});
