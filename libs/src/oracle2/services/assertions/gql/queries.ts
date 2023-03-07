import type { OOV3GraphQuery } from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

export async function getAssertions(url: string, chainId: number) {
  const queryName = makeQueryName("Optimistic Oracle V3", chainId);
  const query = gql`
    query ${queryName} {
      assertions {
        id
        assertionId
        domainId
        claim
        asserter
        callbackRecipient
        escalationManager
        caller
        expirationTime
        currency
        bond
        disputer
        settlementPayout
        settlementRecipient
        settlementResolution
        assertionTimestamp
        assertionBlockNumber
        assertionHash
        assertionLogIndex
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
  const result = await request<OOV3GraphQuery>(url, query);
  return result.assertions;
}
