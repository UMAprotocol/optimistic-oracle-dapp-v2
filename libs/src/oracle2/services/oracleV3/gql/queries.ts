import request, { gql } from "graphql-request";
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
export const getRequests = async (url: string): Promise<Assertions> => {
  const query = gql`
    {
      assertions {
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
      }
    }
  `;
  const result = await request<AssertionsQuery>(url, query);
  return result.assertions;
};
