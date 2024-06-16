import { Duration } from "luxon";

const landOffset = Duration.fromObject({ minutes: 8, seconds: 40 });
const endOffset = Duration.fromObject({ hours: 4 });

const blackShardInterval = Duration.fromObject({ hours: 8 });
const redShardInterval = Duration.fromObject({ hours: 6 });

const realms = ["prairie", "forest", "valley", "wasteland", "vault"];

const shardsInfo = [
  {
    noShardWkDay: [6, 7], // Sat; Sun
    interval: blackShardInterval,
    offset: Duration.fromObject({ hours: 1, minutes: 50 }),
    maps: [
      "prairie.butterfly",
      "forest.brook",
      "valley.rink",
      "wasteland.temple",
      "vault.starlight",
    ],
  },
  {
    noShardWkDay: [7, 1], // Sun; Mon
    interval: blackShardInterval,
    offset: Duration.fromObject({ hours: 2, minutes: 10 }),
    maps: [
      "prairie.village",
      "forest.boneyard",
      "valley.rink",
      "wasteland.battlefield",
      "vault.starlight",
    ],
  },
  {
    noShardWkDay: [1, 2], // Mon; Tue
    interval: redShardInterval,
    offset: Duration.fromObject({ hours: 7, minutes: 40 }),
    maps: [
      "prairie.cave",
      "forest.end",
      "valley.dreams",
      "wasteland.graveyard",
      "vault.jelly",
    ],
  },
  {
    noShardWkDay: [2, 3], // Tue; Wed
    interval: redShardInterval,
    offset: Duration.fromObject({ hours: 2, minutes: 20 }),
    maps: [
      "prairie.bird",
      "forest.tree",
      "valley.dreams",
      "wasteland.crab",
      "vault.jelly",
    ],
  },
  {
    noShardWkDay: [3, 4], // Wed; Thu
    interval: redShardInterval,
    offset: Duration.fromObject({ hours: 3, minutes: 30 }),
    maps: [
      "prairie.island",
      "forest.sunny",
      "valley.hermit",
      "wasteland.ark",
      "vault.jelly",
    ],
  },
];

const overrideRewardAC = {
  "forest.end": 2.5,
  "valley.dreams": 2.5,
  "forest.tree": 3.5,
  "vault.jelly": 3.5,
};

export function getShardInfo(date, override) {
  const today = date.setZone("America/Los_Angeles").startOf("day");
  const dayOfMth = today.day;
  const dayOfWk = today.weekday;
  const isRed = override?.isRed ?? dayOfMth % 2 === 1;
  const realmIdx = override?.realm ?? (dayOfMth - 1) % 5;
  const infoIndex =
    override?.group ??
    (dayOfMth % 2 === 1 ? (((dayOfMth - 1) / 2) % 3) + 2 : (dayOfMth / 2) % 2);
  const { noShardWkDay, interval, offset, maps, defRewardAC } =
    shardsInfo[infoIndex];
  const hasShard = override?.hasShard ?? !noShardWkDay.includes(dayOfWk);
  const map = override?.map ?? maps[realmIdx];
  const rewardAC = isRed ? overrideRewardAC[map] ?? defRewardAC : undefined;

  let firstStart = today.plus(offset);

  if (dayOfWk === 7 && today.isInDST !== firstStart.isInDST) {
    firstStart = firstStart.plus({ hours: firstStart.isInDST ? -1 : 1 });
  }

  const occurrences = Array.from({ length: 3 }, (_, i) => {
    const start = firstStart.plus(interval.mapUnits((x) => x * i));
    const land = start.plus(landOffset);
    const end = start.plus(endOffset);
    return { start, land, end };
  });

  return {
    date,
    isRed,
    hasShard,
    offset,
    interval,
    lastEnd: occurrences[2].end,
    realm: realms[realmIdx],
    map,
    rewardAC,
    occurrences,
  };
}

export function findNextShard(from, opts = {}) {
  const info = getShardInfo(from);
  const { only } = opts;
  if (!only || (only === "red") === info.isRed) {
    return info;
  } else {
    return findNextShard(from.plus({ days: 1 }), { only });
  }
}
