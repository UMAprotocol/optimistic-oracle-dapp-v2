import type { OptimisticOracleInterfaceEthers } from "@uma/contracts-frontend";
import {
  OptimisticOracleInterfaceEthers__factory,
  getOptimisticOracleInterfaceAbi,
} from "@uma/contracts-frontend";
import { parseIdentifier } from "@libs/utils";
import type { SignerOrProvider, GetEventType } from "@libs/types";
import type { Event, BigNumberish, BigNumber } from "ethers";
import { utils } from "ethers";

export type Instance = OptimisticOracleInterfaceEthers;
const Factory = OptimisticOracleInterfaceEthers__factory;

export function connect(address: string, provider: SignerOrProvider): Instance {
  return Factory.connect(address, provider);
}

export const contractInterface = new utils.Interface(
  getOptimisticOracleInterfaceAbi(),
);

export type RequestPrice = GetEventType<Instance, "RequestPrice">;
export type ProposePrice = GetEventType<Instance, "ProposePrice">;
export type DisputePrice = GetEventType<Instance, "DisputePrice">;
export type Settle = GetEventType<Instance, "Settle">;

export enum RequestState {
  Invalid = 0, // Never requested.
  Requested, // Requested, no other actions taken.
  Proposed, // Proposed, but not expired or disputed yet.
  Expired, // Proposed, not disputed, past liveness.
  Disputed, // Disputed, but no DVM price returned yet.
  Resolved, // Disputed and DVM price is available.
  Settled, // Final price has been set in the contract (can get here from Expired or Resolved).
}

// all events have these values
export type RequestKey = {
  requester: string;
  identifier: string;
  timestamp: number;
  ancillaryData: string;
};
export type Request = RequestKey &
  // this is partial since we dont know what events we have to populate parts of this
  Partial<{
    proposer: string;
    disputer: string;
    currency: string;
    settled: boolean;
    refundOnDispute: boolean;
    proposedPrice: BigNumber;
    resolvedPrice: BigNumber;
    expirationTime: BigNumber;
    reward: BigNumber;
    finalFee: BigNumber;
    bond: BigNumber;
    customLiveness: BigNumber;
    price: BigNumber;
    payout: BigNumber;
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
  }>;

export interface EventState {
  requests?: Record<string, Request>;
}

export function requestId(
  request: Omit<RequestKey, "timestamp"> & { timestamp: BigNumberish },
): string {
  // this matches how we generate ids in the subgraph
  return [
    parseIdentifier(request.identifier),
    request.timestamp.toString(),
    request.ancillaryData,
  ].join("-");
}

export function reduceEvents(state: EventState, event: Event): EventState {
  switch (event.event) {
    case "RequestPrice": {
      const typedEvent = event as RequestPrice;
      const {
        requester,
        identifier,
        timestamp,
        ancillaryData,
        currency,
        reward,
        finalFee,
      } = typedEvent.args;
      const id = requestId(typedEvent.args);
      if (!state.requests) state.requests = {};
      const request: Request = state.requests[id] || {
        requester,
        identifier,
        timestamp,
        ancillaryData,
      };
      state.requests[id] = {
        ...request,
        currency,
        reward,
        finalFee,
        state: RequestState.Requested,
        requestTx: event.transactionHash,
        requestBlockNumber: event.blockNumber,
        requestLogIndex: event.logIndex,
      };
      break;
    }
    case "ProposePrice": {
      const typedEvent = event as ProposePrice;
      const {
        requester,
        identifier,
        timestamp,
        ancillaryData,
        proposer,
        proposedPrice,
        expirationTimestamp,
        currency,
      } = typedEvent.args;
      const id = requestId(typedEvent.args);
      if (!state.requests) state.requests = {};
      const request: Request = state.requests[id] || {
        requester,
        identifier,
        timestamp,
        ancillaryData,
      };
      state.requests[id] = {
        ...request,
        currency,
        proposer,
        proposedPrice,
        expirationTime: expirationTimestamp,
        state: RequestState.Proposed,
        proposeTx: event.transactionHash,
        proposeBlockNumber: event.blockNumber,
        proposeLogIndex: event.logIndex,
      };
      break;
    }
    case "DisputePrice": {
      const typedEvent = event as DisputePrice;
      const {
        requester,
        identifier,
        timestamp,
        ancillaryData,
        proposer,
        disputer,
        proposedPrice,
      } = typedEvent.args;
      const id = requestId(typedEvent.args);
      if (!state.requests) state.requests = {};
      const request: Request = state.requests[id] || {
        requester,
        identifier,
        timestamp,
        ancillaryData,
      };
      state.requests[id] = {
        ...request,
        proposer,
        disputer,
        proposedPrice,
        state: RequestState.Disputed,
        disputeTx: event.transactionHash,
        disputeBlockNumber: event.blockNumber,
        disputeLogIndex: event.logIndex,
      };
      break;
    }
    case "Settle": {
      const typedEvent = event as Settle;
      const {
        requester,
        identifier,
        timestamp,
        ancillaryData,
        proposer,
        disputer,
        price,
        payout,
      } = typedEvent.args;
      const id = requestId(typedEvent.args);
      if (!state.requests) state.requests = {};
      const request: Request = state.requests[id] || {
        requester,
        identifier,
        timestamp,
        ancillaryData,
      };
      state.requests[id] = {
        ...request,
        requester,
        proposer,
        disputer,
        price,
        payout,
        state: RequestState.Settled,
        settleTx: event.transactionHash,
        settleBlockNumber: event.blockNumber,
        settleLogIndex: event.logIndex,
      };
      break;
    }
  }
  return state;
}
export function getEventState(
  events: Event[],
  eventState: EventState = {},
): EventState {
  return events.reduce(reduceEvents, eventState);
}
