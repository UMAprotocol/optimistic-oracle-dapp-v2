import type { DropdownItem } from "@/types/ui";
import { Identifier } from "./abstract";
import type { MetaData, ParsedQuery } from "./abstract";

export class AcrossV2 extends Identifier {
  constructor() {
    super({
      name: "ACROSS-V2",
      umipNumber: 157,
    });
  }

  getMetaData(_decodedAncillaryData: string): MetaData {
    return {
      title: "Across V2 Request",
      description:
        "Across is an optimistic insured bridge that relies on a decentralized group of relayers to fulfill user deposit requests from EVM to EVM networks. Relayer funds are insured by liquidity providers in a single pool on Ethereum and refunds are processed via the UMA Optimistic Oracle. [Learn more.](https://docs.across.to/)",
      umipUrl: this.umipUrl,
      umipNumber: this.umipNumber,
    };
  }
  parseQuery(decodedAncillaryData: string): ParsedQuery {
    return {
      ...this.getMetaData(decodedAncillaryData),
      proposeOptions: this.makeProposeOptions(decodedAncillaryData),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    return [
      { label: "Yes", value: "1", secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
    ];
  }
  makeProposeOptions(_decodedAncillaryData: string): DropdownItem[] {
    return this.makeDefaultProposeOptions();
  }
}
