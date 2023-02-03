import { supportedChainsById } from "@/constants";
import { Request } from "@libs/oracle/types/interfaces";
import { ReactNode } from "react";

export type OracleQuery = Request & OracleQueryMetadata;

export type OracleQueryMetadata = {
  type: OracleType;
  expiryType: ExpiryType;
  project: Project;
  title: ReactNode;
};

export type OracleType =
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle"
  | "Optimistic Asserter";

export type SupportedChainIds = keyof typeof supportedChainsById;

export type ExpiryType = "Event-based" | "Time-based";

export type Project = "uma" | "polymarket" | "cozy";
