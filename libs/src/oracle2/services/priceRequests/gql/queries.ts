import type { OracleType, PriceRequestQuery } from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

export async function getPriceRequests<Result extends PriceRequestQuery>(
  url: string,
  chainId: number,
  oracleType: OracleType
) {
  const queryName = makeQueryName(oracleType, chainId);
  const isV2 = oracleType === "Optimistic Oracle V2";
  const query = gql`
    query ${queryName} {
      optimisticPriceRequests {
        id
        identifier
        ancillaryData
        time
        requester
        currency
        reward
        finalFee
        proposer
        proposedPrice
        proposalExpirationTimestamp
        disputer
        settlementPrice
        settlementPayout
        settlementRecipient
        state
        requestTimestamp
        requestBlockNumber
        requestHash
        requestLogIndex
        proposalTimestamp
        proposalBlockNumber
        proposalHash
        proposalLogIndex
        disputeTimestamp
        disputeBlockNumber
        disputeHash
        disputeLogIndex
        settlementTimestamp
        settlementBlockNumber
        settlementHash
        settlementLogIndex
        ${
          isV2
            ? `
              customLiveness
              bond
              eventBased
              `
            : ""
        }
      }
    }
  `;
  const result = await request<Result>(url, query);
  return result.optimisticPriceRequests;
}
