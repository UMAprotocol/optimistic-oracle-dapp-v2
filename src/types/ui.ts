import type {
  chainNames,
  chainsById,
  currencies,
  expiryTypes,
  oracleTypes,
  projects,
} from "@/constants";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type { BigNumber } from "ethers";
import type { ReactNode } from "react";
export type ActionType = "Dispute" | "Propose" | "Settle" | undefined;

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
  bond: string | undefined;
  // oo
  price: string | undefined;
  expiryType: ExpiryType | undefined;
  currency: Currency | undefined;
  oracleAddress: string;
  tokenAddress: string | undefined;
  formattedBond: string | undefined;
  formattedReward: string | undefined;
  assertion: boolean | undefined;
};
export type BigNumberish = string | number | BigNumber;

export type Tag = {
  icon: string;
  text: string;
};
export type Time = {
  unix: string;
  utc: string;
};
export type Token = {
  // details
  decimals: number;
  symbol: string;
  icon: string;
  // actions
  formatAmount: (wei: BigNumberish) => string;
  approve: (address: string, spender: string, amount: BigNumberish) => void;
  balance: (address: string) => void;
  details: () => void;
};
export type Amount = {
  formatted: string;
  icon: string;
};
export type QuerySummary = {
  icon: string;
  title: string;
  subtitle: {
    project: string;
    timestamp: string;
    chain: string;
    expiryType: string;
    formatted: string;
  };
  click: () => void;
};
export type VerifyQuerySummary = QuerySummary & {
  proposal: string;
  startTime: number;
  endTime: number;
};

export type ProposeQuerySummary = QuerySummary & {
  bond: Amount;
  reward: Amount;
};

export type SettledQuerySummary = QuerySummary & {
  result: string;
};

export type QueryDetails = {
  timestamp: Time;
  ancillaryData: {
    formatted: string;
    bytes: string;
  };
  tags: Tag[];
  moreInfo: MoreInformationItem[];
  error: ErrorMessage;
  primaryAction: {
    disabled: boolean;
    tooltip: string;
    submit: (input?: BigNumberish) => void;
    label: string;
  };
};
export type VerifyQueryDetails = QueryDetails & {
  bond: Amount;
  reward: Amount;
  bondToken: Token;
  rewardToken: Token;
  proposal: string;
  expiry: string;
  dispute: () => void;
};

export type VerifyQuery = {
  type: "verify";
  summary: VerifyQuerySummary;
  details: VerifyQueryDetails;
};
export type ProposeQueryDetails = QueryDetails & {
  bond: Amount;
  reward: Amount;
  bondToken: Token;
  rewardToken: Token;
  challengePeriod: string;
  propose: (value: BigNumberish) => void;
};
export type ProposeQuery = {
  type: "propose";
  summary: ProposeQuerySummary;
  details: ProposeQueryDetails;
};

export type LifeCycleDetail = {
  icon: string;
  name: string;
  address: string;
  href: string;
  timeFormatted: string;
};
export type SettledQueryDetails = QueryDetails & {
  proposal: string;
  lifecycle: LifeCycleDetail[];
  settle: () => void;
};

export type SettledQuery = {
  type: "settled";
  summary: SettledQuerySummary;
  details: SettledQueryDetails;
};

export type OracleQuery = SettledQuery | ProposeQuery | VerifyQuery;
export type OracleQueries = OracleQuery[];

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

export type OnCheckedChange = (payload: CheckedChangePayload) => void;

export type PageName = "verify" | "propose" | "settled";
