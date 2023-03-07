import type { OracleType } from "@libs/oracle2/types";
import request, { gql } from "graphql-request";
import { makeQueryName } from "./utils";

export type OptimisticPriceRequest = {
  id: string;
  identifier: string;
  ancillaryData: string;
  time: string;
  requester: string;
  currency: string;
  reward: string;
  finalFee: string;
  proposer: string;
  proposedPrice: string;
  proposalExpirationTimestamp: string;
  disputer: string;
  settlementPrice: string;
  settlementPayout: string;
  settlementRecipient: string;
  state: string;
  requestTimestamp: string;
  requestBlockNumber: number;
  requestHash: string;
  requestLogIndex: number;
  proposalTimestamp: string;
  proposalBlockNumber: number;
  proposalHash: string;
  proposalLogIndex: number;
  disputeTimestamp: string;
  disputeBlockNumber: number;
  disputeHash: string;
  disputeLogIndex: number;
  settlementTimestamp: string;
  settlementBlockNumber: number;
  settlementHash: string;
  settlementLogIndex: number;
};
export type OptimisticPriceRequests = OptimisticPriceRequest[];
export type OptimisticPriceRequestsQuery = {
  optimisticPriceRequests: OptimisticPriceRequests;
};
export const getRequests = async (
  url: string,
  chainId: number,
  oracleType: OracleType
): Promise<OptimisticPriceRequests> => {
  const queryName = makeQueryName(oracleType, chainId);
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
      }
    }
  `;
  const result = await request<OptimisticPriceRequestsQuery>(url, query);
  return result.optimisticPriceRequests;
};
