import { chainsById } from "@shared/constants";
import type { ChainId, OracleType, PriceRequestsQuery } from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

export async function getPriceRequests<Query extends PriceRequestsQuery>(
  url: string,
  chainId: ChainId,
  oracleType: OracleType
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName);
  const isV2 = oracleType === "Optimistic Oracle V2";
  const query = gql`
    query ${queryName} {
      optimisticPriceRequests(orderBy: time, orderDirection: desc, first:500) {
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
  const result = await request<Query>(url, query);
  return result.optimisticPriceRequests;
}
