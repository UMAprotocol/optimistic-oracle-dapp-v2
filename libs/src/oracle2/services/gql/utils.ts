import type { OptimisticPriceRequest } from "./oracleV1";
import type { Assertion as GqlAssertion } from "./asserter";
import type { Request, Assertion } from "../../types";
import { RequestState } from "../../types";

export function isRequestState(
  state: string | undefined
): state is RequestState {
  if (state === undefined) return false;
  return state in RequestState;
}

export function convertV1(
  request: OptimisticPriceRequest,
  chainId: number,
  oracleAddress: string
): Request {
  return {
    // request key
    requester: request.requester,
    identifier: request.identifier,
    timestamp: request.time,
    ancillaryData: request.ancillaryData,
    // meta data
    chainId,
    oracleAddress,
    oracleType: "Optimistic Oracle V1",
    id: request.id,
    // everything else
    proposer: request.proposer,
    disputer: request.disputer,
    currency: request.currency,
    settled: Boolean(request.settlementRecipient),
    proposedPrice: request.proposedPrice,
    resolvedPrice: request.settlementPrice,
    expirationTime: request.proposalExpirationTimestamp,
    reward: request.reward,
    finalFee: request.finalFee,
    price: request.settlementPrice,
    payout: request.settlementPayout,
    state: isRequestState(request.state) ? request.state : undefined,
    requestTx: request.requestHash,
    proposeTx: request.proposalHash,
    disputeTx: request.disputeHash,
    settleTx: request.settlementHash,
    requestBlockNumber: request.requestBlockNumber,
    proposeBlockNumber: request.proposalBlockNumber,
    disputeBlockNumber: request.disputeBlockNumber,
    settleBlockNumber: request.settlementBlockNumber,
    requestLogIndex: request.requestLogIndex,
    proposeLogIndex: request.proposalLogIndex,
    disputeLogIndex: request.disputeLogIndex,
    settleLogIndex: request.settlementLogIndex,
  };
}

export function convertAssertion(
  assertion: GqlAssertion,
  chainId: number,
  oracleAddress: string
): Assertion {
  return {
    chainId,
    oracleType: "Optimistic Asserter",
    oracleAddress,
    ...assertion,
  };
}
