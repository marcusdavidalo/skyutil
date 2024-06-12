const dateFnsTz = require("date-fns-tz");
const dateFns = require("date-fns");

const US_PACIFIC_TIME_ZONE = "America/Los_Angeles";
const TIME_PATTERN = "HH:mm:ss";
const DATE_PATTERN = "yyyy-MM-dd";

function getTimeTokens(formattedTime) {
  const [hour, minute, second] = formattedTime.split(":");
  return {
    hour: parseInt(hour),
    minute: parseInt(minute),
    second: parseInt(second),
  };
}

function getDateTokens(formattedDate) {
  const [year, month, day] = formattedDate.split("-");
  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
  };
}

export function getLocalTime(date) {
  const formattedTime = dateFns.format(date, TIME_PATTERN);
  const formattedDate = dateFns.format(date, DATE_PATTERN);
  const timeTokens = getTimeTokens(formattedTime);
  const dateTokens = getDateTokens(formattedDate);

  return { ...timeTokens, ...dateTokens };
}

export function getFormattedSkyTime(date, formatString) {
  return dateFnsTz.formatInTimeZone(date, US_PACIFIC_TIME_ZONE, formatString);
}

export function getSkyTime(date) {
  const formattedTime = dateFnsTz.formatInTimeZone(
    date,
    US_PACIFIC_TIME_ZONE,
    TIME_PATTERN
  );
  return getTimeTokens(formattedTime);
}
