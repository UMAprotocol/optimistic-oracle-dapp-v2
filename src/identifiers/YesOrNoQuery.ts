import type { DropdownItem } from "@/types/ui";
import { Identifier } from "./abstract";
import type { MetaData } from "./abstract";
import { getTitleAndDescriptionFromTokens } from "@/helpers/queryParsing";

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
      proposeOptions: this.makeProposeOptions(),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    return [
      { label: "Yes", value: "1", secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
    ];
  }

  makeProposeOptions(): DropdownItem[] {
    // For YES_OR_NO_QUERY, the default options are always used
    return this.makeDefaultProposeOptions();
  }
}
