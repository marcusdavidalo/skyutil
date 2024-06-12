import { eventDefinitions } from "./eventData";
import { getEventOffset } from "./eventTimeOffset";

// Function to get all events with their next occurrence
export function getNextEvents(currentDate) {
  const groupedEvents = {};

  Object.keys(eventDefinitions).forEach((eventKey) => {
    const eventData = eventDefinitions[eventKey];
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

  return groupedEvents;
}
