import React, { useEffect, useState, useRef } from "react";
import { getNextEvents } from "../services/events/eventsLogic";
import { eventTypeNames } from "../services/events/eventData";

const EventSchedules = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const localTimeRef = useRef(null);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      const nextEvents = getNextEvents(currentDate);
      setGroupedEvents(nextEvents);
      if (localTimeRef.current) {
        localTimeRef.current.textContent = `Local Time: ${currentDate.toLocaleTimeString()}`;
      }
    };

    const update = () => {
      updateTime();
      requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(update);
    };
  }, []);

  return (
    <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Event Schedules
        </h2>
      </div>
      <div className="space-y-6">
        {Object.keys(groupedEvents).map((type) => (
          <div
            key={type}
            className="bg-white/50 dark:bg-zinc-800/50 p-2 shadow-zinc-800/20 dark:shadow-zinc-200/20 shadow-md rounded-md w-full"
          >
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-300 mb-2 text-center bg-zinc-400/50 dark:bg-zinc-900/50 p-2 rounded-md text-shadow-lg inset-2 shadow-inner shadow-zinc-800/20 dark:shadow-zinc-200/20">
              {eventTypeNames[type]}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="font-bold text-lg py-2">
                  <tr className="text-zinc-800 dark:text-zinc-200 text-left uppercase tracking-wider">
                    <th>Event Name</th>
                    <th>Next Event</th>
                    <th>Time to Next</th>
                  </tr>
                </thead>
                <tbody className="font-thin text-base text-shadow-md">
                  {groupedEvents[type].map((event) => (
                    <tr key={event.key}>
                      <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                        {event.name}
                      </td>
                      <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                        {event.name === "Aviary Fireworks" &&
                        !event.isAviaryEventDay ? (
                          <>
                            {monthNames[event.date.getMonth()]}{" "}
                            {event.date.getDate()}{" "}
                          </>
                        ) : (
                          <>
                            {String(event.hour).padStart(2, "0")}:
                            {String(event.minute).padStart(2, "0")}
                          </>
                        )}
                      </td>
                      <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                        {event.name === "Aviary Fireworks" &&
                        !event.isAviaryEventDay ? (
                          <>{event.daysOffset} days</>
                        ) : (
                          <>
                            {event.hoursOffset}h {event.minutesOffset}m{" "}
                            {event.second}s
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSchedules;
