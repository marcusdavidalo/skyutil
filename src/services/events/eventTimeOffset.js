import { add } from "date-fns";
import { getLocalTime, getSkyTime } from "./eventTime";
import { eventNames } from "./eventData";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getDaysToNextMonth(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  const daysInMonth = getDaysInMonth(year, month);
  return daysInMonth - day; // Days remaining in this month
}

export function getMinutesToNextEvent(currentDate, eventData) {
  const { hour, minute, second } = getSkyTime(currentDate);

  if (eventData.key === eventNames.AVIARY_FIREWORKS) {
    const day = currentDate.getDate();
    const isEventDay = day === 1;

    if (!isEventDay) {
      const daysToNextMonth = getDaysToNextMonth(currentDate);
      return (daysToNextMonth + 1) * 24 * 60;
    } else {
      const currentHour = currentDate.getHours();
      const nextEventHour = Math.ceil(currentHour / 4) * 4;
      const hoursToNextEvent = nextEventHour - currentHour;

      return hoursToNextEvent * 60 - minute;
    }
  }

  const hourOffset = eventData.hour(hour);
  const minuteOffset = eventData.minute(minute);
  const secondOffset = eventData.second ? eventData.second(second) : 0;

  if (eventData.period === 24 * 60) {
    return hourOffset * 60 + minuteOffset + secondOffset / 60;
  } else if (hourOffset > 0) {
    return (
      eventData.period - (hourOffset * 60 - minuteOffset + secondOffset / 60)
    );
  } else if (minuteOffset > 0) {
    return minuteOffset + secondOffset / 60;
  } else {
    return eventData.period - Math.abs(minuteOffset + secondOffset / 60);
  }
}

export function getEventOffset(eventData, currentDate) {
  const minutesToNextEvent = getMinutesToNextEvent(currentDate, eventData);
  const totalSecondsToNextEvent = Math.floor(minutesToNextEvent * 60);
  const totalHoursToNextEvent = Math.floor(totalSecondsToNextEvent / 3600);
  const daysOffset = Math.floor(totalHoursToNextEvent / 24);
  const hoursOffset = totalHoursToNextEvent % 24;
  const minutesOffset = Math.floor((totalSecondsToNextEvent % 3600) / 60);

  const nextEventDate = add(currentDate, { seconds: totalSecondsToNextEvent });
  const localTime = getLocalTime(nextEventDate);

  const { day, hour, minute, second } = localTime;

  return {
    date: nextEventDate,
    minutesToNextEvent,
    totalSecondsToNextEvent, // Added total seconds to next event for sorting
    daysOffset,
    hoursOffset,
    minutesOffset,
    day,
    hour,
    minute,
    second: 60 - second,
    isAviaryEventDay: currentDate.getDate() === 1, // Flag for displaying day information
  };
}
