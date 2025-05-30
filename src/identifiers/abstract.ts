import type { DropdownItem } from "@/types/ui";

export type MetaData = {
  title: string;
  description: string;
  umipNumber: `umip-${number}`;
  umipUrl: string;
};

export type ParsedQuery = MetaData & {
  proposeOptions: DropdownItem[];
};

export abstract class Identifier {
  name: string;
  umipNumber: `umip-${number}`; // umip-181
  umipUrl: string;

  constructor({
    name,
    umipNumber,
  }: {
    name: string; // "YES_OR_NO_QUERY"
    umipNumber: number; // 181
  }) {
    this.name = name;
    this.umipNumber = `umip-${umipNumber}`;
    this.umipUrl = `https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-${umipNumber}.md`;
  }
  abstract parseQuery(decodedAncillaryData: string): ParsedQuery;
  abstract getMetaData(decodedAncillaryData: string): MetaData;
  abstract makeDefaultProposeOptions(): DropdownItem[];
  abstract makeProposeOptions(decodedAncillaryData: string): DropdownItem[];
}
