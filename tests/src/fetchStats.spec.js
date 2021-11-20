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
  it("should fetch correct stats", async () => {
    mock.onPost("https://gitlab.com/api/graphql").reply(200, data);

    let stats = await fetchStats("oregand");
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

  it("should throw error", async () => {
    mock.onPost("https://gitlab.com/api/graphql").reply(200, error);

    await expect(fetchStats("anuraghazra")).rejects.toThrow(
      "Could not resolve to a User with the username of 'noname'."
    );
  });
});
