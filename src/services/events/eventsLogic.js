import { eventDefinitions } from "./eventData";
import { getEventOffset } from "./eventTimeOffset";
import { DateTime } from "luxon";

export function getNextEvents(currentDate) {
  const groupedEvents = {};

  Object.values(eventDefinitions).forEach((eventData) => {
    const offset = getEventOffset(eventData, currentDate);
    const startTime = DateTime.fromJSDate(offset.date);
    const endTime = startTime.plus({ minutes: eventData.duration || 0 });

    const eventType = eventData.type;
    if (!groupedEvents[eventType]) {
      groupedEvents[eventType] = [];
    }

    groupedEvents[eventType].push({
      ...eventData,
      ...offset,
      endTime,
    });
  });

  // Sort events in each group by end time
  Object.values(groupedEvents).forEach((events) => {
    events.sort((a, b) => a.endTime.toMillis() - b.endTime.toMillis());
  });

  return groupedEvents;
}
