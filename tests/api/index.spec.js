require("@testing-library/jest-dom");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const api = require("../../api/index");
const renderStatsCard = require("../../src/renderStatsCard");
const { renderError } = require("../../src/utils");
const calculateRank = require("../../src/calculateRank");

const stats = {
  name: "David O'Regan",
  totalMRs: 100,
  totalProjects: 0,
  totalGroups: 0,
  totalTodos: 0,
  rank: null,
};

stats.rank = calculateRank({
  mrs: stats.totalMRs,
});

const data = {
  data: {
    user: {
      name: stats.name,
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
      message: "Could not fetch user",
    },
  ],
};

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

describe("src/api/index.js", () => {
  it("should send a valid request to the GitLab GraphQL API", async () => {
    const req = {
      query: {
        username: "oregand",
      },
    };
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    mock.onPost("https://gitlab.com/api/graphql").reply(200, data);

    await api(req, res);

    expect(res.setHeader).toBeCalledWith("Content-Type", "image/svg+xml");
    expect(res.send).toBeCalledWith(renderStatsCard(stats, { ...req.query }));
  });

  it("should render error card on retruned error", async () => {
    const req = {
      query: {
        username: "oregand",
      },
    };
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    mock.onPost("https://gitlab.com/api/graphql").reply(200, error);

    await api(req, res);

    expect(res.setHeader).toBeCalledWith("Content-Type", "image/svg+xml");
    expect(res.send).toBeCalledWith(renderError(error.errors[0].message));
  });

  it("should get the query options", async () => {
    const req = {
      query: {
        username: "oregand",
        hide: ``,
        show_icons: true,
        hide_border: false,
        line_height: 100,
        title_color: "fff",
        icon_color: "fff",
        text_color: "fff",
        bg_color: "fff",
      },
    };
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    mock.onPost("https://gitlab.com/api/graphql").reply(200, data);

    await api(req, res);

    expect(res.setHeader).toBeCalledWith("Content-Type", "image/svg+xml");
    expect(res.send).toBeCalledWith(
      renderStatsCard(stats, {
        hide: [],
        show_icons: true,
        hide_border: false,
        line_height: 100,
        title_color: "fff",
        icon_color: "fff",
        text_color: "fff",
        bg_color: "fff",
      })
    );
  });
});
