require("@testing-library/jest-dom");
const calculateRankSpec = require("../../src/calculateRank");

describe("src/calculateRank.js", () => {
  it("should calculate the GitLab rank correctly", () => {
    expect(
      calculateRankSpec({
        mrs: 100,
      })
    ).toStrictEqual({ level: "A+", score: 50.000000050000004 });
  });
});
