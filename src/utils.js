const axios = require("axios");
const themes = require("../themes");

const renderError = (message) => {
  return `
    <svg width="495" height="100" viewBox="0 0 495 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
    .text { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: #2F80ED }
    .small { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #252525 }
    </style>
    <rect x="0.5" y="0.5" width="494" height="99%" rx="4.5" fill="#FFFEFE" stroke="#E4E2E2"/>
    <text x="25" y="45" class="text">Something went wrong! file an issue at https://gitlab.com/oregand/gitlab-readme-stats/-/issues</text>
    <text id="message" x="25" y="65" class="text small">${message}</text>
    </svg>
  `;
};

// https://stackoverflow.com/a/48073476/10629172
function encodeHTML(str) {
  return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
}

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

function isValidHexColor(hexColor) {
  return new RegExp(
    /^([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4})$/
  ).test(hexColor);
}

function parseBoolean(value) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else {
    return value;
  }
}

function fallbackColor(color, fallbackColor) {
  return (isValidHexColor(color) && `#${color}`) || fallbackColor;
}

function request(data, headers) {
  let requestUrl = "https://gitlab.com/api/graphql";
  if (data.gitlab_url) requestUrl = data.gitlab_url;

  return axios({
    url: requestUrl,
    method: "post",
    headers,
    data,
  });
}

function requestCalendar(data, headers) {
  let requestUrl = `https://gitlab.com`;
  if (data.gitlab_url) requestUrl = data.gitlab_url;

  if (requestUrl.startsWith("/"))  
    requestUrl = `${requestUrl}api/v4/users/${data.variables.username}/events`;
  else
    requestUrl= `${requestUrl}/api/v4/users/${data.variables.username}/events`;

  let params = new URLSearchParams({
    per_page: 100,
    page: data.page,
    action: "commented, merged, approved, closed, pushed, created"
  })

  if (data.end) {
    params.append("before", data.end)
  }
  if (data.start) {
    params.append("after", data.start)
  }

  return axios({
    url: requestUrl,
    method: "get",
    params,
    headers,
  });
}

/**
 *
 * @param {String[]} items
 * @param {Number} gap
 * @param {string} direction
 *
 * @description
 * Auto layout utility, allows us to layout things
 * vertically or horizontally with proper gaping
 */
function FlexLayout({ items, gap, direction }) {
  // filter() for filtering out empty strings
  return items.filter(Boolean).map((item, i) => {
    let transform = `translate(${gap * i}, 0)`;
    if (direction === "column") {
      transform = `translate(0, ${gap * i})`;
    }
    return `<g transform="${transform}">${item}</g>`;
  });
}

// returns theme based colors with proper overrides and defaults
function getCardColors({
  title_color,
  text_color,
  icon_color,
  bg_color,
  theme,
  fallbackTheme = "default",
}) {
  const defaultTheme = themes[fallbackTheme];
  const selectedTheme = themes[theme] || defaultTheme;

  // get the color provided by the user else the theme color
  // finally if both colors are invalid fallback to default theme
  const titleColor = fallbackColor(
    title_color || selectedTheme.title_color,
    "#" + defaultTheme.title_color
  );
  const iconColor = fallbackColor(
    icon_color || selectedTheme.icon_color,
    "#" + defaultTheme.icon_color
  );
  const textColor = fallbackColor(
    text_color || selectedTheme.text_color,
    "#" + defaultTheme.text_color
  );
  const bgColor = fallbackColor(
    bg_color || selectedTheme.bg_color,
    "#" + defaultTheme.bg_color
  );

  return { titleColor, iconColor, textColor, bgColor };
}

module.exports = {
  renderError,
  kFormatter,
  encodeHTML,
  isValidHexColor,
  request,
  requestCalendar,
  parseBoolean,
  fallbackColor,
  FlexLayout,
  getCardColors,
};
