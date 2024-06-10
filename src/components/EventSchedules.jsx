import React, { useEffect, useState } from "react";
import { getNextEvents } from "../services/events/eventsLogic";

const EventSchedules = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      const nextEvents = getNextEvents(currentDate);
      setEvents(nextEvents);
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="font-mono bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 md:p-6 lg:p-8">
      <div className="flex font-bold justify-between items-center">
        <h2 className="mb-4 text-3xl dark:text-white">Event Schedules</h2>
        <h2 className="text-2xl font-thin text-gray-600 dark:text-gray-200 mb-4">
          Local Time: {new Date().toLocaleTimeString()}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="font-bold text-lg py-2">
            <tr>
              <th className=" text-left text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Event Name
              </th>
              <th className=" text-left text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Next Event
              </th>
              <th className=" text-left text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                Time to Next
              </th>
            </tr>
          </thead>
          <tbody className=" font-thin text-base">
            {events.map((event) => (
              <tr key={event.key}>
                <td className="py-2 border-b border-gray-200 dark:border-gray-700">
                  {event.name}
                </td>
                <td className="py-2 border-b border-gray-200 dark:border-gray-700">
                  {String(event.hour).padStart(2, "0")}:
                  {String(event.minute).padStart(2, "0")}
                </td>
                <td className="py-2 border-b border-gray-200 dark:border-gray-700">
                  {event.hoursOffset}h {event.minutesOffset}m
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventSchedules;
