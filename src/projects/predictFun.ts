import { Project } from "./abstract";
import type { DropdownItem } from "@/types";
import { maybeMakePolymarketOptions } from "./polymarket";

export class PredictFunProject extends Project<"Predict.Fun"> {
  constructor() {
    super({
      name: "Predict.Fun",
      requesters: ["0x2C0367a9DB231dDeBd88a94b4f6461a6e47C58B1"],
      initializers: ["0x0168e3F4DE550942ce528FE9697d387A33465BA1"],
      identifiers: ["YES_OR_NO_QUERY"],
      requiredTokens: {
        YES_OR_NO_QUERY: ["res_data:", "q: title:"],
      },
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
