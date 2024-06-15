import React, { useState, useEffect } from "react";
import { findNextShard } from "../services/shards/shardsLogic";
import { DateTime } from "luxon";

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

  useEffect(() => {
    const currentDate = DateTime.local();
    const shardInfo = findNextShard(currentDate);
    const { occurrences, haveShard } = shardInfo;

    if (haveShard) {
      setTodayShardEvent({
        ...shardInfo,
        occurrences: occurrences,
        timeZone: currentDate.zoneName,
      });
    }
  }, []);

  if (!todayShardEvent) {
    return <div>No shards today.</div>;
  }

  const { realm, map, occurrences, isRed, timeZone } = todayShardEvent;
  const shardType = isRed ? "Red Shard" : "Black Shard";
  const fullRealmName = {
    prairie: "Daylight Prairie",
    forest: "Hidden Forest",
    valley: "Valley of Triumph",
    wasteland: "Golden Wasteland",
    vault: "Vault of Knowledge",
  }[realm];
  const fullMapName = mapLocation(map);

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
              <thead className="font-bold text-lg py-2">
                <tr className="text-zinc-800 dark:text-zinc-200 text-left uppercase tracking-wider">
                  <th>Occurrence</th>
                  <th>Start Time</th>
                  <th>Land Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody className="font-thin text-base text-shadow-md">
                {occurrences.map((occurrence, idx) => (
                  <tr key={idx}>
                    <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                      {idx + 1}
                    </td>
                    <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                      {occurrence.start
                        .setZone(timeZone)
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                    </td>
                    <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                      {occurrence.land
                        .setZone(timeZone)
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                    </td>
                    <td className="py-2 border-b border-zinc-200 dark:border-zinc-700">
                      {occurrence.end
                        .setZone(timeZone)
                        .toLocaleString(DateTime.TIME_SIMPLE)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShardSchedules;
