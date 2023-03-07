export type OOV1GraphQuery = {
  optimisticPriceRequests: OOV1GraphEntity[];
};

export type OOV2GraphQuery = {
  optimisticPriceRequests: OOV2GraphEntity[];
};

export type OOV3GraphQuery = {
  assertions: OOV3GraphEntity[];
};

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

export type OOV2GraphEntity = OOV1GraphEntity & {
  customLiveness: string | null;
  bond: string | null;
  eventBased: boolean | null;
};

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
