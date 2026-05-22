import { describe, expect, it } from "vitest";
import type { Address } from "wagmi";
import {
  deprecatedPolymarketBulletinOwnerCutoffTimestamp,
  getBulletinOwnerQueries,
  mergePolymarketBulletinUpdates,
  resolveBulletinOwner,
  type RawPolymarketBulletinUpdate,
} from "./polymarketBulletinOwners";

const deprecatedInitializer =
  "0x91430cad2d3975766499717fa0d66a78d814e5c5" as Address;
const currentBulletinOwner =
  "0xF43d55F3A8B7484Ed4B6931f93CB6F9eF5Dd369D" as Address;

describe("resolveBulletinOwner", () => {
  it("maps the deprecated Polymarket initializer to the current bulletin owner", () => {
    expect(resolveBulletinOwner(deprecatedInitializer)).toBe(
      currentBulletinOwner,
    );
  });

  it("matches deprecated initializer addresses case-insensitively", () => {
    expect(
      resolveBulletinOwner(deprecatedInitializer.toUpperCase() as Address),
    ).toBe(currentBulletinOwner);
  });

  it("returns unmapped initializer addresses unchanged", () => {
    const initializer = "0x1111111111111111111111111111111111111111" as Address;

    expect(resolveBulletinOwner(initializer)).toBe(initializer);
  });
});

describe("getBulletinOwnerQueries", () => {
  it("queries the current owner and the deprecated owner with a cutoff", () => {
    expect(getBulletinOwnerQueries(deprecatedInitializer)).toEqual([
      { owner: currentBulletinOwner },
      {
        owner: deprecatedInitializer,
        maxTimestamp: deprecatedPolymarketBulletinOwnerCutoffTimestamp,
      },
    ]);
  });

  it("returns one unchanged owner query for unmapped initializers", () => {
    const initializer = "0x1111111111111111111111111111111111111111" as Address;

    expect(getBulletinOwnerQueries(initializer)).toEqual([
      { owner: initializer },
    ]);
  });
});

describe("mergePolymarketBulletinUpdates", () => {
  function update(
    timestamp: number,
    text: string,
  ): RawPolymarketBulletinUpdate {
    return { timestamp, update: text };
  }

  it("filters deprecated-owner updates by cutoff and sorts merged updates", () => {
    const updatesByOwner = [
      [
        update(
          deprecatedPolymarketBulletinOwnerCutoffTimestamp + 20,
          "current",
        ),
        update(
          deprecatedPolymarketBulletinOwnerCutoffTimestamp - 20,
          "current-old",
        ),
      ],
      [
        update(
          deprecatedPolymarketBulletinOwnerCutoffTimestamp + 10,
          "deprecated-new",
        ),
        update(
          deprecatedPolymarketBulletinOwnerCutoffTimestamp - 10,
          "deprecated-old",
        ),
      ],
    ];

    expect(
      mergePolymarketBulletinUpdates(
        updatesByOwner,
        getBulletinOwnerQueries(deprecatedInitializer),
      ),
    ).toEqual([
      update(
        deprecatedPolymarketBulletinOwnerCutoffTimestamp - 20,
        "current-old",
      ),
      update(
        deprecatedPolymarketBulletinOwnerCutoffTimestamp - 10,
        "deprecated-old",
      ),
      update(deprecatedPolymarketBulletinOwnerCutoffTimestamp + 20, "current"),
    ]);
  });
});
