import type { BigNumber } from "ethers";
import type { ChainId, OracleType, RequestState } from "./oracle";

export type PriceRequestQuery = OOV1GraphQuery | OOV2GraphQuery;

export type AssertionQuery = OOV3GraphQuery;

export type PriceRequestGraphEntity = OOV1GraphEntity | OOV2GraphEntity;

export type AssertionGraphEntity = OOV3GraphEntity;

export type OOV1GraphQuery = {
  optimisticPriceRequests: OOV1GraphEntity[];
};

export type OOV2GraphQuery = {
  optimisticPriceRequests: OOV2GraphEntity[];
};

export type OOV3GraphQuery = {
  assertions: OOV3GraphEntity[];
};

/**
 enum OptimisticPriceRequestState {
  Invalid
  Requested
  Proposed
  Expired
  Disputed
  Resolved
  Settled
}

type OptimisticPriceRequest @entity {
  "ID is the PriceIdentifier ID + the timestamp + ancillaryData (if available)"
  id: ID!

  identifier: String!

  ancillaryData: String!

  time: BigInt!

  requester: Bytes!

  currency: Bytes!

  reward: BigInt!

  finalFee: BigInt!

  proposer: Bytes

  proposedPrice: BigInt

  proposalExpirationTimestamp: BigInt

  disputer: Bytes

  settlementPrice: BigInt

  settlementPayout: BigInt

  settlementRecipient: Bytes

  state: OptimisticPriceRequestState

  requestTimestamp: BigInt

  requestBlockNumber: BigInt

  requestHash: Bytes

  requestLogIndex: BigInt

  proposalTimestamp: BigInt

  proposalBlockNumber: BigInt

  proposalHash: Bytes

  proposalLogIndex: BigInt

  disputeTimestamp: BigInt

  disputeBlockNumber: BigInt

  disputeHash: Bytes

  disputeLogIndex: BigInt

  settlementTimestamp: BigInt

  settlementBlockNumber: BigInt

  settlementHash: Bytes

  settlementLogIndex: BigInt
}
 */
export type OOV1GraphEntity = {
  id: string;

  identifier: string;

  ancillaryData: string;

  time: string;

  requester: string;

  currency: string;

  reward: string;

  finalFee: string;

  proposer: string | null;

  proposedPrice: string | null;

  proposalExpirationTimestamp: string | null;

  disputer: string | null;

  settlementPrice: string | null;

  settlementPayout: string | null;

  settlementRecipient: string | null;

  state: string | null;

  requestTimestamp: string | null;

  requestBlockNumber: string | null;

  requestHash: string | null;

  requestLogIndex: string | null;

  proposalTimestamp: string | null;

  proposalBlockNumber: string | null;

  proposalHash: string | null;

  proposalLogIndex: string | null;

  disputeTimestamp: string | null;

  disputeBlockNumber: string | null;

  disputeHash: string | null;

  disputeLogIndex: string | null;

  settlementTimestamp: string | null;

  settlementBlockNumber: string | null;

  settlementHash: string | null;

  settlementLogIndex: string | null;
};

/**
  enum OptimisticPriceRequestState {
  Invalid
  Requested
  Proposed
  Expired
  Disputed
  Resolved
  Settled
}

type OptimisticPriceRequest @entity {
  "ID is the PriceIdentifier ID + the timestamp + ancillaryData (if available)"
  id: ID!

  identifier: String!

  ancillaryData: String!

  time: BigInt!

  requester: Bytes!

  currency: Bytes!

  reward: BigInt!

  finalFee: BigInt!

  proposer: Bytes

  proposedPrice: BigInt

  proposalExpirationTimestamp: BigInt

  disputer: Bytes

  settlementPrice: BigInt

  settlementPayout: BigInt

  settlementRecipient: Bytes

  state: OptimisticPriceRequestState

  requestTimestamp: BigInt

  requestBlockNumber: BigInt

  requestHash: Bytes

  requestLogIndex: BigInt

  proposalTimestamp: BigInt

  proposalBlockNumber: BigInt

  proposalHash: Bytes

  proposalLogIndex: BigInt

  disputeTimestamp: BigInt

  disputeBlockNumber: BigInt

  disputeHash: Bytes

  disputeLogIndex: BigInt

  settlementTimestamp: BigInt

  settlementBlockNumber: BigInt

  settlementHash: Bytes

  settlementLogIndex: BigInt

  customLiveness: BigInt

  bond: BigInt

  eventBased: Boolean
}
 */
export type OOV2GraphEntity = OOV1GraphEntity & {
  customLiveness: string | null;
  bond: string | null;
  eventBased: boolean | null;
};

/**
  type Assertion @entity {
  "ID is the PriceIdentifier ID + the timestamp + ancillaryData (if available)"
  id: ID!

  assertionId: String!

  domainId: String!

  claim: String!

  asserter: Bytes!

  identifier: String!

  callbackRecipient: Bytes!

  escalationManager: Bytes!

  caller: Bytes!

  expirationTime: BigInt!

  currency: Bytes!

  bond: BigInt!

  disputer: Bytes

  settlementPayout: BigInt

  settlementRecipient: Bytes

  settlementResolution: Boolean

  assertionTimestamp: BigInt

  assertionBlockNumber: BigInt

  assertionHash: Bytes

  assertionLogIndex: BigInt

  disputeTimestamp: BigInt

  disputeBlockNumber: BigInt

  disputeHash: Bytes

  disputeLogIndex: BigInt

  settlementTimestamp: BigInt

  settlementBlockNumber: BigInt

  settlementHash: Bytes

  settlementLogIndex: BigInt
}
 */
export type OOV3GraphEntity = {
  id: string;

  assertionId: string;

  domainId: string;

  claim: string;

  asserter: string;

  identifier: string;

  callbackRecipient: string;

  escalationManager: string;

  caller: string;

  expirationTime: string;

  currency: string;

  bond: string;

  disputer: string | null;

  settlementPayout: string | null;

  settlementRecipient: string | null;

  settlementResolution: string | null;

  assertionTimestamp: string | null;

  assertionBlockNumber: string | null;

  assertionHash: string | null;

  assertionLogIndex: string | null;

  disputeTimestamp: string | null;

  disputeBlockNumber: string | null;

  disputeHash: string | null;

  disputeLogIndex: string | null;

  settlementTimestamp: string | null;

  settlementBlockNumber: string | null;

  settlementHash: string | null;

  settlementLogIndex: string | null;
};

export type ParsedOOV1GraphEntity = {
  chainId: ChainId;
  oracleAddress: string;
  oracleType: OracleType;
  id: string;
  identifier: string;
  ancillaryData: string;
  time: BigNumber;
  requester: string;
  currency: string;
  reward: BigNumber;
  finalFee: BigNumber;
  proposer: string | undefined;
  proposedPrice: BigNumber | undefined;
  proposalExpirationTimestamp: BigNumber | undefined;
  disputer: string | undefined;
  settlementPrice: BigNumber | undefined;
  settlementPayout: BigNumber | undefined;
  state: RequestState;
  requestTimestamp: BigNumber | undefined;
  requestBlockNumber: BigNumber | undefined;
  requestHash: string | undefined;
  requestLogIndex: BigNumber | undefined;
  proposalTimestamp: BigNumber | undefined;
  proposalBlockNumber: BigNumber | undefined;
  proposalHash: string | undefined;
  proposalLogIndex: BigNumber | undefined;
  disputeTimestamp: BigNumber | undefined;
  disputeBlockNumber: BigNumber | undefined;
  disputeHash: string | undefined;
  disputeLogIndex: BigNumber | undefined;
  settlementTimestamp: BigNumber | undefined;
  settlementBlockNumber: BigNumber | undefined;
  settlementLogIndex: BigNumber | undefined;
};

export type ParsedV2GraphEntity = ParsedOOV1GraphEntity & {
  customLiveness: BigNumber | undefined;
  bond: BigNumber | undefined;
  eventBased: boolean | undefined;
};
