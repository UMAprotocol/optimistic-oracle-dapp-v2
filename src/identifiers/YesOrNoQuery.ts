import type { DropdownItem } from "@/types/ui";
import { Identifier } from "./abstract";
import type { MetaData } from "./abstract";
import { getTitleAndDescriptionFromTokens } from "@/helpers/queryParsing";
import { maybeMakePolymarketOptions } from "@/projects/polymarket";

export class YesOrNoQuery extends Identifier {
  constructor() {
    super({
      name: "YES_OR_NO_QUERY",
      umipNumber: 107,
    });
  }

  getMetaData(decodedAncillaryData: string): MetaData {
    const { title, description } =
      getTitleAndDescriptionFromTokens(decodedAncillaryData);

    return {
      title: title ?? this.name,
      description: description ?? decodedAncillaryData,
      umipUrl: this.umipUrl,
      umipNumber: this.umipNumber,
    };
  }

  parseQuery(decodedAncillaryData: string) {
    return {
      ...this.getMetaData(decodedAncillaryData),
      proposeOptions: this.makeProposeOptions(decodedAncillaryData),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    return [
      { label: "Yes", value: "1", secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
      {
        label: "Custom",
        value: "custom",
      },
      {
        label: "Unknown",
        value: "0.5",
        secondaryLabel: "50/50",
      },
    ];
  }

  makeProposeOptions(decodedAncillaryData: string): DropdownItem[] {
    // first try to parse res_data options
    const polyMarketOptions = maybeMakePolymarketOptions(decodedAncillaryData);
    // fallback to identifier standard
    return polyMarketOptions ?? this.makeDefaultProposeOptions();
  }
}
