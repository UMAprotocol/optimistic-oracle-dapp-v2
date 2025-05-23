import { getTitleAndDescriptionFromTokens } from "@/helpers/queryParsing";
import { Identifier } from "./abstract";
import type { MetaData } from "./abstract";
import type { DropdownItem } from "@/types/ui";

export class RopuEthx extends Identifier {
  constructor() {
    super({
      name: "ROPU_ETHx",
      umipNumber: 177,
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
    // RopuEthx doesn't have fixed default options based on the code
    return [];
  }

  makeProposeOptions(_decodedAncillaryData: string): DropdownItem[] {
    // Since there's no specific parsing logic for RopuEthx in queryParsing.ts,
    // return default options
    return this.makeDefaultProposeOptions();
  }
}
