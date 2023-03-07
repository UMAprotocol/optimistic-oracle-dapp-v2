import type { OracleType } from "@libs/oracle2/types";
import request, { gql } from "graphql-request";
import { makeQueryName } from "../../priceRequests/gql/utils";
export type Assertion = {
  id: string;
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
};
export type Assertions = Assertion[];
export type AssertionsQuery = {
  assertions: Assertions;
};
export const getRequests = async (
  url: string,
  oracleType: OracleType,
  chainId: number
): Promise<Assertions> => {
  const queryName = makeQueryName(oracleType, chainId);
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
  const result = await request<AssertionsQuery>(url, query);
  return result.assertions;
};
