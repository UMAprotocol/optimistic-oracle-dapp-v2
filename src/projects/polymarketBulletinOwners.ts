import type { Address } from "wagmi";

// Maps deprecated initializer EOAs to the current bulletin-board owner that
// posts clarifications on their behalf. The questionId remains unchanged.
// May 22, 2026 at 1:00 AM PT.
export const deprecatedPolymarketBulletinOwnerCutoffTimestamp = 1779436800;

type BulletinOwnerRemap = {
  owner: Address;
  deprecatedOwnerUpdatesUntil?: number;
};

export type BulletinOwnerQuery = {
  owner: Address;
  maxTimestamp?: number;
};

export type RawPolymarketBulletinUpdate = {
  timestamp: bigint | number | { toString(): string };
  update: string;
};

const deprecatedInitializer = "0x91430cad2d3975766499717fa0d66a78d814e5c5";

const bulletinOwnerRemaps: Record<string, BulletinOwnerRemap> = {
  [deprecatedInitializer]: {
    owner: "0xF43d55F3A8B7484Ed4B6931f93CB6F9eF5Dd369D",
    deprecatedOwnerUpdatesUntil:
      deprecatedPolymarketBulletinOwnerCutoffTimestamp,
  },
};

function getTimestampNumber(
  timestamp: RawPolymarketBulletinUpdate["timestamp"],
) {
  return Number(timestamp.toString());
}

export function resolveBulletinOwner(initializer: Address): Address {
  return bulletinOwnerRemaps[initializer.toLowerCase()]?.owner ?? initializer;
}

export function getBulletinOwnerQueries(
  initializer: Address,
): BulletinOwnerQuery[] {
  const ownerRemap = bulletinOwnerRemaps[initializer.toLowerCase()];

  if (!ownerRemap) {
    return [{ owner: initializer }];
  }

  const ownerQueries: BulletinOwnerQuery[] = [{ owner: ownerRemap.owner }];

  if (ownerRemap.deprecatedOwnerUpdatesUntil !== undefined) {
    ownerQueries.push({
      owner: initializer,
      maxTimestamp: ownerRemap.deprecatedOwnerUpdatesUntil,
    });
  }

  return ownerQueries;
}

export function mergePolymarketBulletinUpdates<
  TUpdate extends RawPolymarketBulletinUpdate,
>(
  updatesByOwner: readonly (readonly TUpdate[])[],
  ownerQueries: readonly BulletinOwnerQuery[],
): TUpdate[] {
  return updatesByOwner
    .flatMap((updates, ownerIndex) => {
      const ownerQuery = ownerQueries[ownerIndex];

      return updates.filter((update) => {
        return (
          ownerQuery?.maxTimestamp === undefined ||
          getTimestampNumber(update.timestamp) <= ownerQuery.maxTimestamp
        );
      });
    })
    .sort(
      (a, b) =>
        getTimestampNumber(a.timestamp) - getTimestampNumber(b.timestamp),
    );
}
