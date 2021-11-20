function normalcdf(mean, sigma, to) {
  const z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  let sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
}

function calculateRank({ mrs }) {
  const MRS_OFFSET = 0.5;
  const ALL_OFFSETS = MRS_OFFSET;
  const RANK_S_VALUE = 1;
  const RANK_DOUBLE_A_VALUE = 25;
  const RANK_A2_VALUE = 45;
  const RANK_A3_VALUE = 60;
  const RANK_B_VALUE = 100;
  const TOTAL_VALUES =
    RANK_S_VALUE + RANK_A2_VALUE + RANK_A3_VALUE + RANK_B_VALUE;

  const score = (mrs * MRS_OFFSET) / 100;

  const normalizedScore = normalcdf(score, TOTAL_VALUES, ALL_OFFSETS) * 100;

  let level = "";

  if (normalizedScore < RANK_S_VALUE) {
    level = "S+";
  }
  if (
    normalizedScore >= RANK_S_VALUE &&
    normalizedScore < RANK_DOUBLE_A_VALUE
  ) {
    level = "S";
  }
  if (
    normalizedScore >= RANK_DOUBLE_A_VALUE &&
    normalizedScore < RANK_A2_VALUE
  ) {
    level = "A++";
  }
  if (normalizedScore >= RANK_A2_VALUE && normalizedScore < RANK_A3_VALUE) {
    level = "A+";
  }
  if (normalizedScore >= RANK_A3_VALUE && normalizedScore < RANK_B_VALUE) {
    level = "B+";
  }

  return { level, score: normalizedScore };
}

module.exports = calculateRank;
