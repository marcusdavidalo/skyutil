import React, { useEffect, useState, useRef } from "react";
import { getNextEvents } from "../services/events/eventsLogic";
import { eventTypeNames } from "../services/events/eventData";
import { monthNames } from "../utils/monthNames";

import { DateTime } from "luxon";

const EventSchedules = () => {
  const [groupedEvents, setGroupedEvents] = useState({});
  const localTimeRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const currentDate = new Date();
      const nextEvents = getNextEvents(currentDate);
      setGroupedEvents(nextEvents);
      if (localTimeRef.current) {
        localTimeRef.current.textContent = `Local Time: ${currentDate.toLocaleTimeString()}`;
      }
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function formatTime(hour, minute, duration) {
    const startTime = DateTime.local().set({ hour, minute });
    const endTime = startTime.plus({ minutes: duration });

    const startTimeString = startTime.toLocaleString(DateTime.TIME_SIMPLE);
    const endTimeString = endTime.toLocaleString(DateTime.TIME_SIMPLE);

    return `${startTimeString} - ${endTimeString}`;
  }

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
              <table className="min-w-full border-collapse md:table">
                <thead className="font-bold text-xs sm:text-sm md:text-md lg:text-lg py-2">
                  <tr className="text-zinc-800 dark:text-zinc-200 text-left uppercase tracking-wider text-wrap">
                    <th className="p-2">Event Name</th>
                    <th className="p-2">Next Event</th>
                    <th className="p-2">Time to Next</th>
                  </tr>
                </thead>
                <tbody className="font-thin text-base text-shadow-md">
                  {groupedEvents[type].map((event) => {
                    const currentTime = DateTime.local();
                    const startTime = DateTime.local().set({
                      hour: event.hour,
                      minute: event.minute,
                    });
                    const endTime = startTime.plus({
                      minutes: event.duration || 0,
                    });
                    const nextEventTime =
                      currentTime > endTime
                        ? startTime.plus({ minutes: event.period })
                        : null;

                    const totalDuration = endTime.diff(
                      startTime,
                      "seconds"
                    ).seconds;
                    const elapsedDuration =
                      currentTime < startTime
                        ? 0
                        : currentTime.diff(startTime, "seconds").seconds;
                    const progress = (elapsedDuration / totalDuration) * 100;

                    return (
                      <tr key={event.key} className="relative">
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {event.name}
                        </td>
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {currentTime > endTime && nextEventTime
                            ? nextEventTime.toLocaleString(DateTime.TIME_SIMPLE)
                            : event.duration
                            ? formatTime(
                                event.hour,
                                event.minute,
                                event.duration
                              )
                            : startTime.toLocaleString(DateTime.TIME_SIMPLE)}
                        </td>
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {event.isMonthly ? (
                            <>{event.daysOffset} days</>
                          ) : (
                            <>
                              {event.hoursOffset}h {event.minutesOffset}m{" "}
                              {event.second}s
                            </>
                          )}
                        </td>
                        {event.duration && currentTime < endTime && (
                          <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r from-green-500/10 from-30% via-zinc-800/10 via-50% to-red-600/20 text-end ${
                              progress < 100 ? "rounded-r-full" : ""
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        )}
                      </tr>
                    );
                  })}
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
