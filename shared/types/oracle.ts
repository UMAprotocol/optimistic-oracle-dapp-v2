import type {
  chainNames,
  chainsById,
  expiryTypes,
  oracleTypes,
  projects,
  requestStates,
} from "@shared/constants";
import type { Address } from "wagmi";
import {ParsedOOV1GraphEntity,ParsedOOV2GraphEntity,ParsedOOV3GraphEntity} from "./graphql";

export type Request = {
  chainId: ChainId;
  oracleAddress: Address;
  oracleType: OracleType;
  id: string;
  identifier: string;
  ancillaryData: string;
  time: string;
  requester: Address;
} & (Partial<ParsedOOV1GraphEntity> | Partial<ParsedOOV2GraphEntity>);

export type Assertion = {
  chainId: ChainId;
  oracleAddress: Address;
  oracleType: OracleType;
  id:string,
  assertionId: string;
} & Partial<{
  identifier: string;
  asserter: string;
  claim: string;
  assertionTimestamp: string;
}> & Partial<ParsedOOV3GraphEntity>;

export type Requests = Request[];

export type Assertions = Assertion[];

export type OracleTypes = typeof oracleTypes;

export type OracleType = OracleTypes[number];

export type RequestStates = typeof requestStates;

export type RequestState = RequestStates[number];

export type ChainsById = typeof chainsById;

export type ChainId = keyof ChainsById;

export type ChainNames = typeof chainNames;

export type ChainName = ChainNames[number];

export type ExpiryTypes = typeof expiryTypes;

export type ExpiryType = ExpiryTypes[number];

export type Projects = typeof projects;

export type Project = Projects[number];

export type PageName = "verify" | "propose" | "settled";

export type Transaction = {
  id: string;
  state: "created" | "confirmed" | "submitted" | "error";
  error?: Error;
};
export type Transactions = Transaction[];
