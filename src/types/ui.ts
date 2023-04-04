import type { actionTitles } from "@/constants";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type {
  disputeAssertionAbi,
  disputePriceAbi,
  proposePriceAbi,
  settleAssertionAbi,
  settlePriceAbi,
  skinnyDisputePriceAbi,
  skinnyProposePriceAbi,
  skinnySettlePriceAbi,
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
import type { Address, erc20ABI } from "wagmi";

export type ActionTitles = typeof actionTitles;

export type ActionTitle = ActionTitles[number];

export type ActionType = "dispute" | "propose" | "settle" | null;

// request type that needs to be passed to skinny oo
export interface SolidityRequest {
  proposer: string; // Address of the proposer.
  disputer: string; // Address of the disputer.
  currency: string; // ERC20 token used to pay rewards and fees.
  settled: boolean; // True if the request is settled.
  proposedPrice: BigNumber; // Price that the proposer submitted.
  resolvedPrice: BigNumber; // Price resolved once the request is settled.
  expirationTime: BigNumber; // Time at which the request auto-settles without a dispute.
  reward: BigNumber; // Amount of the currency to pay to the proposer on settlement.
  finalFee: BigNumber; // Final fee to pay to the Store upon request to the DVM.
  bond: BigNumber; // Bond that the proposer and disputer must pay on top of the final fee.
  customLiveness: BigNumber; // Custom liveness value set by the requester.
}

export type ProposePriceParamsFactory = (
  proposedPrice?: string
) => ProposePriceParams | undefined;
export type ProposePriceSkinnyParamsFactory = (
  proposedPrice?: string
) => ProposePriceSkinnyParams | undefined;
export type DisputeAssertionParamsFactory = (
  disputerAddress: Address | undefined
) => DisputeAssertionParams | undefined;
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
  description: ReactNode;
  expiryType: ExpiryType | null;
  oracleAddress: Address;
  // not always available with assertions
  identifier?: string;
  // price requests query text is the ancillary data
  // for assertions it is the `claim` field
  queryTextHex?: string;
  queryText?: string;
  // for price requests the value text is null until a price is proposed. Then it is the proposed price. After a price is settled it is the settled price.
  // for assertions the value text is null until settlement, after which it is the `settlementResolution` field
  valueText: string | null;
  timeUTC?: string;
  timeUNIX?: number;
  timeMilliseconds?: number;
  timeFormatted?: string;
  livenessEndsMilliseconds?: number;
  formattedLivenessEndsIn?: string;
  actionType: ActionType | null;
  moreInformation: MoreInformationItem[];
  // for oo-v1 bond is the final fee
  // for oo-v2 bond is the final fee unless `setBond` has been called,
  // it is in the `bond` field returned for the request
  // for oo-v3 the bond is always the `bond` field returned for the request
  bond?: BigNumber;
  reward?: BigNumber | null;
  tokenAddress?: Address;
  approveBondSpendParams?: ApproveBondSpendParams | undefined;
  proposePriceParams?:
    | ProposePriceParamsFactory
    | ProposePriceSkinnyParamsFactory
    | undefined;
  disputePriceParams?:
    | DisputePriceParams
    | DisputePriceSkinnyParams
    | undefined;
  settlePriceParams?: SettlePriceParams | SettlePriceSkinnyParams | undefined;
  disputeAssertionParams?: DisputeAssertionParamsFactory | undefined;
  settleAssertionParams?: SettleAssertionParams | undefined;
  state?: string | undefined;
  // additional searchable properties, note these get parsed to strings even if bigint so we can compare with ==
  requestTimestamp?: string | null;
  requestHash?: string | null;
  requestLogIndex?: string | null;
  proposalTimestamp?: string | null;
  proposalHash?: string | null;
  proposalLogIndex?: string | null;
  assertionTimestamp?: string | null;
  assertionHash?: string | null;
  assertionLogIndex?: string | null;
  disputeTimestamp?: string | null;
  disputeHash?: string | null;
  disputeLogIndex?: string | null;
  settlementTimestamp?: string | null;
  settlementHash?: string | null;
  settlementLogIndex?: string | null;
};

export type ApproveBondSpendParams = {
  // the token address
  address: Address;
  abi: typeof erc20ABI;
  functionName: "approve";
  chainId: ChainId;
  // oracle address and bond
  args: readonly [Address, BigNumber];
};

export type ProposePriceParams = {
  // the oracle address
  address: Address;
  abi: typeof proposePriceAbi;
  functionName: "proposePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData, proposedPrice
  args: readonly [Address, string, BigNumberish, string, BigNumberish];
};

export type ProposePriceSkinnyParams = {
  // the oracle address
  address: Address;
  abi: typeof skinnyProposePriceAbi;
  functionName: "proposePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData, request, proposedPrice
  args: readonly [
    Address,
    string,
    BigNumberish,
    string,
    SolidityRequest,
    BigNumberish
  ];
};

export type DisputePriceParams = {
  // the oracle address
  address: Address;
  abi: typeof disputePriceAbi;
  functionName: "disputePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData
  args: readonly [Address, string, BigNumberish, string];
};

export type DisputePriceSkinnyParams = {
  // the oracle address
  address: Address;
  abi: typeof skinnyDisputePriceAbi;
  functionName: "disputePrice";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData, request
  args: readonly [Address, string, BigNumberish, string, SolidityRequest];
};

export type SettlePriceParams = {
  // the oracle address
  address: Address;
  abi: typeof settlePriceAbi;
  functionName: "settle";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData
  args: readonly [Address, string, BigNumberish, string];
};

export type SettlePriceSkinnyParams = {
  // the oracle address
  address: Address;
  abi: typeof skinnySettlePriceAbi;
  functionName: "settle";
  chainId: ChainId;
  // requester, identifier, timestamp, ancillaryData, request
  args: readonly [Address, string, BigNumberish, string, SolidityRequest];
};

export type DisputeAssertionParams = {
  // the oracle address
  address: Address;
  abi: typeof disputeAssertionAbi;
  functionName: "disputeAssertion";
  chainId: ChainId;
  // assertion id, user address
  args: readonly [string, Address];
};

export type SettleAssertionParams = {
  // the oracle address
  address: Address;
  abi: typeof settleAssertionAbi;
  functionName: "settleAssertion";
  chainId: ChainId;
  // assertion id
  args: readonly [string];
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

export type UniqueId = string | number;

export type Notification = {
  message: ReactNode;
  id: UniqueId;
  chainId?: ChainId;
  transactionHash?: string;
  type: "success" | "error" | "pending";
};
export type PendingNotification = Notification;

export type SettledEvent = {
  message: ReactNode;
  id: UniqueId;
  pendingId: UniqueId;
};

export type UmipLink = {
  number: string;
  url: string;
};

export type IdentifierDetails = {
  identifier: string;
  summary: string;
  umipLink: UmipLink;
};

export type MetaData = {
  title: string;
  description: string;
  umipUrl: string | undefined;
  umipNumber: string | undefined;
  project: Project;
};
