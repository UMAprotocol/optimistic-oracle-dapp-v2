import { Project } from "./abstract";
import { maybeMakePolymarketOptions } from "./polymarket";
import type { DropdownItem } from "@/types";

export class HitProject extends Project<"Hit"> {
  constructor() {
    super({
      name: "Hit",
      requesters: ["0x46500F8BfF8B8DEE2DA41e8960681C792270e10c"],
      identifiers: ["YES_OR_NO_QUERY"],
    });
  }

  makeProposeOptions(
    decodedAncillaryData: string,
    decodedIdentifier: string,
  ): DropdownItem[] | undefined {
    switch (decodedIdentifier) {
      case "YES_OR_NO_QUERY":
        return maybeMakePolymarketOptions(decodedAncillaryData);
      default:
        return undefined;
    }
  }
}
