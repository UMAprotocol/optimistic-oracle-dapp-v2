import { Project } from "./abstract";
import type { DropdownItem } from "@/types";
import { maybeMakePolymarketOptions } from "./polymarket";

export class PredictFunProject extends Project<"Predict.Fun"> {
  constructor() {
    super({
      name: "Predict.Fun",
      requesters: [
        "0x0c1331e4a4bbd59b7aae2902290506bf8fbe3e6c",
        "0xb0c308abec5d321a7b6a8e3ce43a368276178f7a",
      ],
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
