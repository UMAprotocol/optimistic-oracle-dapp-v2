import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type {
  disputeAssertionAbi,
  disputePriceAbi,
  proposePriceAbi,
} from "@shared/constants/abi";
import type {
  ChainId,
  ChainName,
  ExpiryType,
  OracleType,
  Project,
} from "@shared/types";
import type { BigNumber } from "ethers";
import type { ReactNode } from "react";
import type { erc20ABI } from "wagmi";

export type ActionType = "dispute" | "propose" | "settle" | null;

/**
 * Defines the shape of data required by the UI to render a price request or a an assertion.
 * All of the UI components are "dumb", i.e they expect the data to be available, correct, and formatted when they receive it.
 */
export type OracleQueryUI = {
  // for price requests `id` is constructed with `identifier-timestamp-ancillaryData`
  // for assertions `id` is the `assertionId` field
  id: string;
  chainId: ChainId;
  chainName: ChainName;
  oracleType: OracleType;
  project: Project;
  title: ReactNode;
  identifier: string;
  // price requests query text is the ancillary data
  // for assertions it is the `claim` field
  queryTextHex: string;
  queryText: string;
  // for price requests the value text is null until a price is proposed. Then it is the proposed price. After a price is settled it is the settled price.
  // for assertions the value text is null until settlement, after which it is the `settlementResolution` field
  valueText: string | null;
  timeUTC: string;
  timeUNIX: number;
  timeMilliseconds: number;
  timeFormatted: string;
  livenessEndsMilliseconds: number;
  formattedLivenessEndsIn: string;
  actionType: ActionType | null;
  moreInformation: MoreInformationItem[];
  bond: BigNumber | null;
  reward: BigNumber | null;
  expiryType: ExpiryType | null;
  oracleAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  formattedBond: string | null;
  formattedReward: string | null;
  approveBondSpendParams: ApproveBondSpendParams | null;
  proposePriceParams: ProposePriceParams | null;
  disputePriceParams: DisputePriceParams | null;
  settlePriceParams: SettlePriceParams | null;
  disputeAssertionParams: DisputeAssertionParams | null;
};

export type ApproveBondSpendParams = {
  // the token address
  address: `0x${string}`;
  abi: typeof erc20ABI;
  functionName: "approve";
  chainId: ChainId;
  // oracle address and bond
  args: readonly [`0x${string}`, BigNumber];
};

export type ProposePriceParams = {
  // the oracle address
  address: `0x${string}`;
  abi: typeof proposePriceAbi;
  functionName: "proposePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData, proposedPrice
  args: readonly [`0x${string}`, string, BigNumberish, string, BigNumberish];
};

export type DisputePriceParams = {
  // the oracle address
  address: `0x${string}`;
  abi: typeof disputePriceAbi;
  functionName: "disputePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData
  args: readonly [`0x${string}`, string, BigNumberish, string];
};

export type SettlePriceParams = {
  // the oracle address
  address: `0x${string}`;
  abi: typeof disputePriceAbi;
  functionName: "settle";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData
  args: readonly [`0x${string}`, string, BigNumberish, string];
};

export type DisputeAssertionParams = {
  // the oracle address
  address: `0x${string}`;
  abi: typeof disputeAssertionAbi;
  functionName: "disputeAssertion";
  chainId: ChainId;
  // assertion id, user address
  args: readonly [string, `0x${string}`];
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
