import { supportedChainsById, supportedCurrencies } from "@/constants";
import { ReactNode } from "react";
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
  chainId: SupportedChainId;
  chainName: SupportedChainName;
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
  currency: SupportedCurrency | undefined;
  formattedBond: string | undefined;
  formattedReward: string | undefined;
  // oa
  assertion: boolean | undefined;
};

export type OracleType =
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle"
  | "Optimistic Asserter";

export type SupportedChainsById = typeof supportedChainsById;

export type SupportedChainId = keyof SupportedChainsById;

export type SupportedChainName = SupportedChainsById[SupportedChainId];

export type ExpiryType = "Event-based" | "Time-based";

export type Project = "UMA" | "Polymarket" | "Cozy Finance";

export type SupportedCurrencies = typeof supportedCurrencies;

export type SupportedCurrency = SupportedCurrencies[number];

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
