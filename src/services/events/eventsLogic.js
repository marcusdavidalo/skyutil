import { eventDefinitions } from "./eventData";
import { getEventOffset } from "./eventTimeOffset";

// Function to get all events with their next occurrence
export function getNextEvents(currentDate) {
  const groupedEvents = {};

  Object.values(eventDefinitions).forEach((eventData) => {
    const offset = getEventOffset(eventData, currentDate);

    const eventType = eventData.type;
    if (!groupedEvents[eventType]) {
      groupedEvents[eventType] = [];
    }

    groupedEvents[eventType].push({
      ...eventData,
      ...offset,
    });
  });

  // Sort events in each group by total seconds to next event
  Object.values(groupedEvents).forEach((events) => {
    events.sort(
      (a, b) => a.totalSecondsToNextEvent - b.totalSecondsToNextEvent
    );
  });

  return groupedEvents;
}
