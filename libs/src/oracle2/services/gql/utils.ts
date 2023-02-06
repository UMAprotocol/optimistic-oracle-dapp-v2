import { OptimisticPriceRequest } from "./oracleV1";
import { Request, OracleType } from "../../types";

export function convertV1(
  request: OptimisticPriceRequest,
  chainId: number
): Request {
  return {
    // request key
    requester: request.requester,
    identifier: request.identifier,
    timestamp: request.time,
    ancillaryData: request.ancillaryData,
    // meta data
    chainId,
    oracleType: OracleType.Optimistic,
    id: request.id,
    // everything else
    proposer: request.proposer,
    disputer: request.disputer,
    currency: request.currency,
    settled: Boolean(request.settlementRecipient),
    proposedPrice: request.proposedPrice,
    reward: request.reward,
    finalFee: request.finalFee,
    price: request.settlementPrice,
    payout: request.settlementPayout,
    expirationTime: request.proposalExpirationTimestamp,
  };
}
