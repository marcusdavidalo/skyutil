import { getFormattedSkyTime } from "./eventTime";

const getCurrentDay = (currentDate) =>
  parseInt(getFormattedSkyTime(currentDate, "i"));

export function getShardColor(currentDate) {
  const currentDay = getCurrentDay(currentDate);
  const isRedShard = [5, 6, 7].includes(currentDay);
  return isRedShard ? "Red" : "Black";
}
