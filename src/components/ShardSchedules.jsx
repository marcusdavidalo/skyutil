import React, { useState, useEffect } from "react";
import { findNextShard } from "../services/shards/shardsLogic";
import { DateTime, Settings } from "luxon";

const mapLocation = (key) => {
  const locationMap = {
    "prairie.butterfly": "Butterfly Field",
    "forest.brook": "Forest Brook",
    "valley.rink": "Ice Rink",
    "wasteland.temple": "Broken Temple",
    "vault.starlight": "Starlight Desert",
    "prairie.village": "Village Islands",
    "forest.boneyard": "Boneyard",
    "wasteland.battlefield": "Battlefield",
    "prairie.cave": "Cave",
    "forest.end": "Forest Garden",
    "valley.dreams": "Village of Dreams",
    "wasteland.graveyard": "Graveyard",
    "vault.jelly": "Jellyfish Cove",
    "prairie.bird": "Bird Nest",
    "forest.tree": "Treehouse",
    "wasteland.crab": "Crabfield",
    "prairie.island": "Sanctuary Island",
    "forest.sunny": "Elevated Clearing",
    "valley.hermit": "Hermit Valley",
    "wasteland.ark": "Forgotten Ark",
  };
  return locationMap[key] || key;
};

const ShardSchedules = () => {
  const [todayShardEvent, setTodayShardEvent] = useState(null);
  const [message, setMessage] = useState("Loading...");
  const localZone = Settings.defaultZoneName;

  useEffect(() => {
    const currentDate = DateTime.local().setZone("America/Los_Angeles");
    const shardInfo = findNextShard(currentDate);

    if (shardInfo.hasShard) {
      setTodayShardEvent({
        ...shardInfo,
        occurrences: shardInfo.occurrences.map((occurrence) => ({
          start: DateTime.fromISO(occurrence.start).setZone(
            currentDate.zoneName
          ),
          land: DateTime.fromISO(occurrence.land).setZone(currentDate.zoneName),
          end: DateTime.fromISO(occurrence.end).setZone(currentDate.zoneName),
        })),
        timeZone: currentDate.zoneName,
      });
      setMessage(null);
    } else {
      setTodayShardEvent({
        hasShard: false,
        date: currentDate,
        timeZone: currentDate.zoneName,
      });
      setMessage("No shards today.");
    }
  }, []);

  if (!todayShardEvent.hasShard) {
    return (
      <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 p-4 md:p-6 lg:p-8">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Today's Shard Schedule
        </h2>
        <p className="text-lg text-zinc-800 dark:text-zinc-200">{message}</p>
      </div>
    );
  }

  const { realm, map, occurrences, isRed } = todayShardEvent;
  const shardType = isRed ? "Red Shard" : "Black Shard";
  const fullRealmName = {
    prairie: "Daylight Prairie",
    forest: "Hidden Forest",
    valley: "Valley of Triumph",
    wasteland: "Golden Wasteland",
    vault: "Vault of Knowledge",
  }[realm];
  const fullMapName = mapLocation(map);

  const currentTime = DateTime.local();

  return (
    <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Today's Shard Schedule
        </h2>
      </div>
      <div className="space-y-6">
        <div className="bg-white/50 dark:bg-zinc-800/50 p-2 shadow-zinc-800/20 dark:shadow-zinc-200/20 shadow-md rounded-md w-full">
          <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-300 mb-2 text-center bg-zinc-400/50 dark:bg-zinc-900/50 p-2 rounded-md text-shadow-lg inset-2 shadow-inner shadow-zinc-800/20 dark:shadow-zinc-200/20">
            {`${shardType} - ${fullRealmName} - ${fullMapName}`}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="font-bold text-xs sm:text-sm md:text-md lg:text-lg py-2">
                <tr className="text-zinc-800 dark:text-zinc-200 text-left uppercase tracking-wider text-wrap">
                  <th className="p-2 md:p-4">Occurrence</th>
                  <th className="p-2 md:p-4">Land Time</th>
                  <th className="p-2 md:p-4">End Time</th>
                </tr>
              </thead>
              <tbody className="font-thin text-base text-shadow-md">
                {occurrences.map((occurrence, idx) => {
                  const startTime = occurrence.start.setZone(localZone);
                  const endTime = occurrence.end.setZone(localZone);
                  const landTime = occurrence.land.setZone(localZone);
                  const totalDuration = endTime.diff(
                    startTime,
                    "seconds"
                  ).seconds;
                  const elapsedDuration =
                    currentTime > endTime
                      ? totalDuration
                      : currentTime < startTime
                      ? 0
                      : currentTime.diff(startTime, "seconds").seconds;
                  const progress = (elapsedDuration / totalDuration) * 100;

                  if (currentTime > endTime) {
                    return (
                      <tr key={idx}>
                        <td
                          colSpan="3"
                          className="p-2 text-center bg-red-600/20 text-zinc-800 dark:text-zinc-200 font-semibold"
                        >
                          {"Shard " + (idx + 1)} Ended
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={idx} className="relative">
                      <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                        {"Shard " + (idx + 1)}
                      </td>
                      <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                        {landTime.toLocaleString(DateTime.TIME_SIMPLE)}
                      </td>
                      <td className="p-2 border-b border-zinc-200 dark:border-zinc-700">
                        {endTime.toLocaleString(DateTime.TIME_SIMPLE)}
                      </td>
                      <div
                        className={`absolute left-0 top-0 h-full bg-gradient-to-r from-green-500/10 from-30% via-zinc-800/10 via-50% to-red-600/20 text-end ${
                          progress < 100 ? "rounded-r-full" : ""
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShardSchedules;
