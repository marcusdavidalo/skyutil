import React, { useEffect, useState, useRef } from "react";
import { getNextEvents } from "../services/events/eventsLogic";
import { eventTypeNames } from "../services/events/eventData";
import { DateTime } from "luxon";
import { monthNames } from "../utils/monthNames";

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

  function calculateEventTimes(event) {
    const currentTime = DateTime.local();

    if (event.isMonthly) {
      let nextEventTime = currentTime.set({ day: event.eventDay });
      if (
        currentTime.day > event.eventDay ||
        (currentTime.day === event.eventDay && currentTime.hour >= event.hour)
      ) {
        nextEventTime = nextEventTime.plus({ months: 1 });
      }
      nextEventTime = nextEventTime.set({
        hour: event.hour,
        minute: event.minute,
        second: 0,
      });

      return {
        currentTime,
        startTime: nextEventTime,
        endTime: nextEventTime.plus({ minutes: event.duration || 0 }),
        nextEventTime,
      };
    }

    const startTime = DateTime.local().set({
      hour: event.hour,
      minute: event.minute,
    });
    const endTime = startTime.plus({ minutes: event.duration || 0 });
    const nextEventTime =
      currentTime > endTime
        ? startTime.plus({ minutes: event.period })
        : startTime;

    return { currentTime, startTime, endTime, nextEventTime };
  }

  function calculateProgress(currentTime, startTime, endTime) {
    const totalDuration = endTime.diff(startTime, "seconds").seconds;
    const elapsedDuration =
      currentTime < startTime
        ? 0
        : currentTime > endTime
        ? totalDuration
        : currentTime.diff(startTime, "seconds").seconds;
    return (elapsedDuration / totalDuration) * 100;
  }

  function renderEventTime(currentTime, endTime, nextEventTime, event) {
    if (event.isMonthly) {
      const nextEventMonth = nextEventTime.month - 1; // Luxon months are 1-indexed
      return `${monthNames[nextEventMonth]} ${nextEventTime.day}`;
    }

    if (currentTime > endTime) {
      return nextEventTime.toLocaleString(DateTime.TIME_SIMPLE);
    }
    if (event.duration) {
      return formatTime(event.hour, event.minute, event.duration);
    }
    return nextEventTime.toLocaleString(DateTime.TIME_SIMPLE);
  }

  function renderTimeToNext(event) {
    if (event.isMonthly) {
      return <>{event.daysOffset} days</>;
    }
    return (
      <>
        {event.hoursOffset}h {event.minutesOffset}m {event.second}s
      </>
    );
  }

  function renderProgressBar(event, currentTime, endTime, progress) {
    if (event.duration && currentTime < endTime) {
      return (
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r from-green-500/10 from-30% via-zinc-800/10 via-50% to-red-600/20 text-end ${
            progress < 100 ? "rounded-r-full" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      );
    }
    return null;
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
                    const { currentTime, startTime, endTime, nextEventTime } =
                      calculateEventTimes(event);
                    const progress = calculateProgress(
                      currentTime,
                      startTime,
                      endTime
                    );

                    return (
                      <tr key={event.key} className="relative">
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {event.name}
                        </td>
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {renderEventTime(
                            currentTime,
                            endTime,
                            nextEventTime,
                            event
                          )}
                        </td>
                        <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                          {renderTimeToNext(event)}
                        </td>
                        {renderProgressBar(
                          event,
                          currentTime,
                          endTime,
                          progress
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
