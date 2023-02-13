export enum RequestState {
  Invalid = "Invalid", // Never requested.
  Requested = "Requested", // Requested, no other actions taken.
  Proposed = "Proposed", // Proposed, but not expired or disputed yet.
  Expired = "Expired", // Proposed, not disputed, past liveness.
  Disputed = "Disputed", // Disputed, but no DVM price returned yet.
  Resolved = "Resolved", // Disputed and DVM price is available.
  Settled = "Settled", // Final price has been set in the contract (can get here from Expired or Resolved).
}
/// data needed to identify oracle requests
export type RequestKey = {
  requester: string;
  identifier: string;
  timestamp: string;
  ancillaryData: string;
};

export enum OracleType {
  Optimistic = "Optimistic Oracle",
  OptimisticV2 = "Optimistic Oracle V2",
  Skinny = "Skinny Optimistic Oracle",
  Asserter = "Optimistic Asserter",
}

export type Request = RequestKey & {
  id: string;
  oracleType: OracleType;
  chainId: number;
} & Partial<{
    // this is partial since we dont know what events we have to populate parts of this
    proposer: string;
    disputer: string;
    currency: string;
    settled: boolean;
    proposedPrice: string;
    resolvedPrice: string;
    expirationTime: string;
    reward: string;
    finalFee: string;
    price: string;
    payout: string;
    state: RequestState;
    // metadata about the transaction that triggered the state changes
    requestTx: string;
    proposeTx: string;
    disputeTx: string;
    settleTx: string;
    requestBlockNumber: number;
    proposeBlockNumber: number;
    disputeBlockNumber: number;
    settleBlockNumber: number;
    requestLogIndex: number;
    proposeLogIndex: number;
    disputeLogIndex: number;
    settleLogIndex: number;
    // oo v2 fields moved here from settings object
    bond: string;
    customLiveness: string;
    eventBased: boolean; // True if the request is set to be event-based.
    refundOnDispute: boolean; // True if the requester should be refunded their reward on dispute.
    callbackOnPriceProposed: boolean; // True if callbackOnPriceProposed callback is required.
    callbackOnPriceDisputed: boolean; // True if callbackOnPriceDisputed callback is required.
    callbackOnPriceSettled: boolean; // True if callbackOnPriceSettled callback is required.
  }>;

export type Requests = Request[];

// TODO: fill this out in future pr
export type Assertion = {
  id: string;
  oracleType: OracleType;
  chainId: number;
} & Partial<{
  assertionId: string;
  domainId: string;
  claim: string;
  asserter: string;
  callbackRecipient: string;
  escalationManager: string;
  caller: string;
  expirationTime: string;
  currency: string;
  bond: string;
  disputer: string;
  settlementPayout: string;
  settlementRecipient: string;
  settlementResolution: string;
  assertionTimestamp: string;
  assertionBlockNumber: number;
  assertionHash: string;
  assertionLogIndex: string;
  disputeTimestamp: string;
  disputeBlockNumber: number;
  disputeHash: string;
  disputeLogIndex: string;
  settlementTimestamp: string;
  settlementBlockNumber: number;
  settlementHash: string;
  settlementLogIndex: string;
}>;

export type Assertions = Assertion[];

// This is the data transfer interface from client to view. Use this in a context or reducer to
// map state to whatever you need for display.
export type Handlers = {
  requests?: (requests: Requests) => void;
  assertions?: (assertions: Assertions) => void;
  // errors array indexes into server list. use this to determine which servers are failing
  errors?: (errors: Error[]) => void;
};

export type Service = {
  tick: () => Promise<void>;
};

// this is the interface to implement a server, servers gather information about requests/assertions from any source
export type ServiceFactory = (handlers: Handlers) => Service;
export type ServiceFactories = ServiceFactory[];
