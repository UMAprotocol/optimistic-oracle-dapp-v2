import type {
  chainNames,
  chainsById,
  currencies,
  expiryTypes,
  oracleTypes,
  projects,
} from "@/constants";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
export type ActionType =
  | "Dispute"
  | "Propose"
  | "Settle"
  | "Invalid"
  | "Requested";

/**
 * Defines the shape of data required by the UI to render a price request or a an assertion.
 * All of the UI components are "dumb", i.e they expect the data to be available, correct, and formatted when they receive it.
 */
export type OracleQueryUI = {
  id: string;
  chainId: ChainId;
  chainName: ChainName;
  oracleType: OracleType;
  project: Project;
  title: ReactNode;
  ancillaryData: string;
  decodedAncillaryData: string;
  timeUTC: string;
  timeUNIX: number;
  timeMilliseconds: number;
  timeFormatted: string;
  livenessEndsMilliseconds: number | undefined;
  formattedLivenessEndsIn: string | undefined;
  actionType: ActionType | undefined;
  action: (() => void) | undefined;
  moreInformation: MoreInformationItem[];
  error: string;
  setError: (error: string) => void;
  // oo
  price: string | undefined;
  expiryType: ExpiryType | undefined;
  currency: Currency | undefined;
  formattedBond: string | undefined;
  formattedReward: string | undefined;
  // oa
  assertion: boolean | undefined;
};

export type OracleTypes = typeof oracleTypes;

export type OracleType = OracleTypes[number];

export type ChainsById = typeof chainsById;

export type ChainId = keyof ChainsById;

export type ChainNames = typeof chainNames;

export type ChainName = ChainNames[number];

export type ExpiryTypes = typeof expiryTypes;

export type ExpiryType = ExpiryTypes[number];

export type Projects = typeof projects;

export type Project = Projects[number];

export type Currencies = typeof currencies;

export type Currency = Currencies[number];

export type MoreInformationItem = {
  title: string;
  text: string;
  href: string;
};

export type ErrorMessage = {
  text: string;
  link?: {
    text: string;
    href: string;
  };
};

export type CheckboxState = DropdownMenuCheckboxItemProps["checked"];

export type CheckboxItem = {
  checked: CheckboxState;
  count: number;
};

export type CheckboxItems = {
  All: CheckboxItem;
  [key: string]: CheckboxItem;
};

export type FilterName = "chainName" | "project" | "oracleType";

export type CheckedFiltersByFilterName = Record<FilterName, string[]>;

export type CheckboxItemsByFilterName = Record<FilterName, CheckboxItems>;

export type FilterCheckboxes = Record<string, CheckboxItem>;

export type CheckedChangePayload = {
  filterName: FilterName;
  checked: CheckboxState;
  itemName: string;
};
