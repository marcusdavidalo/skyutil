import { eventDefinitions } from "./eventData";
import { getEventOffset } from "./eventTimeOffset";

// Function to get all events with their next occurrence
export function getNextEvents(currentDate) {
  const events = Object.keys(eventDefinitions).map((eventKey) => {
    const eventData = eventDefinitions[eventKey];
    const offset = getEventOffset(eventData, currentDate);
    return {
      ...eventData,
      ...offset,
    };
  });

  return events;
}
