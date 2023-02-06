import { supportedChainsById } from "@/constants";
import { ReactNode } from "react";

export type PanelContent = {
  chainId: SupportedChainId;
  oracleType: OracleType;
  project: Project;
  title: ReactNode;
  timeUTC: string;
  timeUNIX: number;
  ancillaryData: string;
  decodedAncillaryData: string;
  currency: "USDC" | "ETH";
  formattedBond: string;
  formattedReward: string;
  formattedLivenessEndsIn: string;
  actionType: "Dispute" | "Propose" | "Settle" | undefined;
  action: (() => void) | undefined;
  moreInformation: MoreInformationItem[];
  error: string;
  setError: (error: string) => void;
  // oo
  price: number | undefined;
  expiryType: ExpiryType | undefined;
  // oa
  assertion: boolean | undefined;
};

export type OracleType =
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle"
  | "Optimistic Asserter";

export type SupportedChainId = keyof typeof supportedChainsById;

export type ExpiryType = "Event-based" | "Time-based";

export type Project = "UMA" | "Polymarket" | "Cozy Finance";

export type MoreInformationItem = {
  title: string;
  text: string;
  href: string;
};
