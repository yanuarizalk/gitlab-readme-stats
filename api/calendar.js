require("dotenv").config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`<!DOCTYPE html><body></body>`, {})).window;

global.document = document;
global.self = document;

// const { GitlabCalendar } = require("/home/onechance/Code/labs/gitlab-calendar/dist/index.js");
const { GitlabCalendar } = require("gitlab-calendar");
const { fetchContributionCalendar } = require("../src/fetchStats");
const { renderError } = require("../src/utils");

module.exports = async (req, res) => {
  const {
    username,
    remote_gitlab,
    remote_username,
    combine_remote_and_public,

    start, end, utc_offset,
    day_size, hint_text, day_space,
    months_ago, month_names, weekday_names,
    first_dow, tooltip_date_format
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");
  let data;

  try {
    data = await fetchContributionCalendar({
      username,
      remote_gitlab,
      combine_remote_and_public,
      remote_username,
      start, end
    });
  } catch (err) {
    return res.send(renderError(err.message));
  }

  let opt = {};

  if (utc_offset) {
    opt.utcOffset = utc_offset;
  }
  if (hint_text) {
    opt.hintText = hint_text;
  }
  if (months_ago) {
    opt.monthsAgo = months_ago;
  }
  if (months_ago) {
    opt.monthsAgo = months_ago;
  }
  if (day_size) {
    opt.daySize = day_size;
  }
  if (day_space) {
    opt.daySpace = day_space;
  }
  if (first_dow) {
    opt.firstDayOfWeek = first_dow;
  }
  if (tooltip_date_format) {
    opt.tooltipDateFormat = tooltip_date_format;
  }

  if (start || end) {
    opt.dateRange = {}
    if (start) 
      opt.dateRange.start = new Date(Date.parse(start))
    if (end)
      opt.dateRange.end = new Date(Date.parse(end))
  }
  if (month_names) {
    opt.monthNames = month_names.split(",")
  }
  if (weekday_names) {
    opt.weekdayNames = weekday_names.split(",")
  }

  new GitlabCalendar(document.querySelector("body"), data, opt);

  res.send(document.querySelector("body").innerHTML);
}