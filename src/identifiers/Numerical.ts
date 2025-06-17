import type { DropdownItem } from "@/types";
import type { MetaData } from "./abstract";
import { Identifier } from "./abstract";
import { getTitleAndDescriptionFromTokens } from "@/helpers/queryParsing";

export class Numerical extends Identifier {
  constructor() {
    super({
      name: "NUMERICAL",
      umipNumber: 165,
    });
  }

  getMetaData(decodedAncillaryData: string): MetaData {
    // According to the NUMERICAL identifier spec, the title should be inserted after "q:".
    // However, some integrators follow the YES_OR_NO_QUERY standard which uses "title:" and "description:".
    // Therefore, we check for both formats.
    const { title, description } =
      getTitleAndDescriptionFromTokens(decodedAncillaryData);
    const { title: titleFromQ } = getTitleAndDescriptionFromTokens(
      decodedAncillaryData,
      "q:",
    );

    return {
      title: title ?? titleFromQ ?? this.name,
      description: description ?? title ?? decodedAncillaryData,
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
      { label: "Unresolvable", value: "0.5", secondaryLabel: "Unresolvable" },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }

  makeProposeOptions(): DropdownItem[] {
    return this.makeDefaultProposeOptions();
  }
}
