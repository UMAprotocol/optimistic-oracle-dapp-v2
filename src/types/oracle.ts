import { supportedChainsById } from "@/constants";
import { Request } from "@libs/oracle/types/interfaces";

export type OracleQuery = Request & OracleQueryMetadata;

export type OracleQueryMetadata = {
  type: OracleType;
};

export type OracleType =
  | "Optimistic Oracle"
  | "Optimistic Oracle V2"
  | "Skinny Optimistic Oracle"
  | "Optimistic Asserter";

export type SupportedChainIds = keyof typeof supportedChainsById;

export type ExpiryType = "Event-based" | "Time-based";
