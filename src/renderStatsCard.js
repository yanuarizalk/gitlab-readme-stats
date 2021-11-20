const { kFormatter, getCardColors, FlexLayout } = require("../src/utils");
const getStyles = require("./getStyle");
const icons = require("./icons");

const createTextNode = ({ icon, label, value, id, index, showIcons }) => {
  const kValue = kFormatter(value);
  const staggerDelay = (index + 3) * 150;

  const labelOffset = showIcons ? `x="25"` : "";
  const iconSvg = showIcons
    ? `
    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      ${icon}
    </svg>
  `
    : "";
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat bold" ${labelOffset} y="12.5">${label}:</text>
      <text class="stat" x="135" y="12.5" data-testid="${id}">${kValue}</text>
    </g>
  `;
};

const renderStatsCard = (stats = {}, options = { hide: [] }) => {
  const { name, totalMRs, totalProjects, totalGroups, totalTodos, rank } =
    stats;
  const {
    hide = [],
    show_icons = false,
    hide_title = false,
    hide_border = false,
    hide_rank = false,
    line_height = 25,
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme = "default",
  } = options;

  const lheight = parseInt(line_height);

  // returns theme based colors with proper overrides and defaults
  const { titleColor, textColor, iconColor, bgColor } = getCardColors({
    title_color,
    icon_color,
    text_color,
    bg_color,
    theme,
  });

  // Meta data for creating text nodes with createTextNode function
  const STATS = {
    projects: {
      icon: icons.projects,
      label: "Total Projects",
      value: totalProjects,
      id: "projects",
    },
    mrs: {
      icon: icons.mrs,
      label: "Total Mrs",
      value: totalMRs,
      id: "mrs",
    },
    groups: {
      icon: icons.groups,
      label: "Total Groups",
      value: totalGroups,
      id: "groups",
    },
    todos: {
      icon: icons.todos,
      label: "Todos",
      value: totalTodos,
      id: "todos",
    },
  };

  // filter out hidden stats defined by user & create the text nodes
  const statItems = Object.keys(STATS)
    .filter((key) => !hide.includes(key))
    .map((key, index) =>
      // create the text nodes, and pass index so that we can calculate the line spacing
      createTextNode({
        ...STATS[key],
        index,
        showIcons: show_icons,
      })
    );

  // Calculate the card height depending on how many items there are
  // but if rank circle is visible clamp the minimum height to `150`
  let height = Math.max(
    45 + (statItems.length + 1) * lheight,
    hide_rank ? 0 : 150
  );

  // the better user's score the the rank will be closer to zero so
  // subtracting 100 to get the progress in 100%
  const progress = 100 - rank.score;

  const styles = getStyles({
    titleColor,
    textColor,
    iconColor,
    show_icons,
    progress,
  });

  // Conditionally rendered elements
  const title = hide_title
    ? ""
    : `<text x="25" y="35" class="header">${name}'s GitHub Stats</text>`;

  const border = hide_border
    ? ""
    : `
    <rect 
      data-testid="card-bg"
      x="0.5"
      y="0.5"
      width="494"
      height="99%"
      rx="4.5"
      fill="${bgColor}"
      stroke="#E4E2E2"
    />
  `;

  const rankCircle = hide_rank
    ? ""
    : `<g data-testid="rank-circle" transform="translate(400, ${
        height / 1.85
      })">
        <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
        <circle class="rank-circle" cx="-10" cy="8" r="40" />
        <g class="rank-text">
          <text
            x="${rank.level.length === 1 ? "-4" : "0"}"
            y="0"
            alignment-baseline="central"
            dominant-baseline="central"
            text-anchor="middle"
          >
            ${rank.level}
          </text>
        </g>
      </g>`;

  if (hide_title) {
    height -= 30;
  }

  return `
    <svg width="495" height="${height}" viewBox="0 0 495 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${styles}
      </style>
      
      ${border}
      ${title}
      <g data-testid="card-body-content" transform="translate(0, ${
        hide_title ? -30 : 0
      })">
        ${rankCircle}
        <svg x="0" y="55">
          ${FlexLayout({
            items: statItems,
            gap: lheight,
            direction: "column",
          }).join("")}
        </svg>
      </g>
    </svg>
  `;
};

module.exports = renderStatsCard;
