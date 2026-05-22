import { chainsById } from "@shared/constants";
import type { ChainId, OOV3GraphEntity, OOV3GraphQuery } from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

// --- Shared helpers ---

async function fetchAssertions(url: string, query: string) {
  const result = await request<OOV3GraphQuery>(url, query);
  return result.assertions;
}

export const assertionFields = `
      id
      assertionId
      identifier
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
      settlementLogIndex`;

/**
 * Paginate through subgraph results using skip.
 * @param maxResults - stop paginating once this many results have been collected
 */
async function fetchAllMatching(
  url: string,
  queryBuilder: (first: number, skip: number) => string,
  maxResults = 5000,
) {
  const result: OOV3GraphEntity[] = [];
  let skip = 0;
  const first = 500;
  let assertions = await fetchAssertions(url, queryBuilder(first, skip));

  while (assertions.length > 0 && skip < 5000 && result.length < maxResults) {
    result.push(...assertions);
    skip += first;
    assertions = await fetchAssertions(url, queryBuilder(first, skip));
  }

  return result;
}

// --- Verify: unsettled assertions ---

export async function getVerifyAssertions(url: string, chainId: ChainId) {
  const chainName = chainsById[chainId];
  const queryName =
    makeQueryName("Optimistic Oracle V3", chainName) + "VerifyAssertions";

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      assertions(
        first: ${first}, skip: ${skip},
        where: { settlementHash: null }
      ) { ${assertionFields} }
    }
  `,
  );
}

// --- Settled: assertions with a settlement hash ---

export async function getSettledAssertions(
  url: string,
  chainId: ChainId,
  maxResults?: number,
) {
  const chainName = chainsById[chainId];
  const queryName =
    makeQueryName("Optimistic Oracle V3", chainName) + "SettledAssertions";

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      assertions(
        first: ${first}, skip: ${skip},
        orderBy: assertionTimestamp, orderDirection: desc,
        where: { settlementHash_not: null }
      ) { ${assertionFields} }
    }
  `,
    maxResults,
  );
}

// --- Deeplink: lookup by transaction hash ---

export async function getAssertionByHash(
  url: string,
  txHash: string,
  eventIndex?: number,
) {
  const exactMatchQueries =
    eventIndex !== undefined
      ? `
      byAssertionExact: assertions(where: { assertionHash: "${txHash}", assertionLogIndex: "${eventIndex}" }, first: 1) { ${assertionFields} }
      byDisputeExact: assertions(where: { disputeHash: "${txHash}", disputeLogIndex: "${eventIndex}" }, first: 1) { ${assertionFields} }
      bySettlementExact: assertions(where: { settlementHash: "${txHash}", settlementLogIndex: "${eventIndex}" }, first: 1) { ${assertionFields} }`
      : "";
  const query = gql`
    query GetAssertionByHash {${exactMatchQueries}
      byAssertion: assertions(where: { assertionHash: "${txHash}" }, first: 100) { ${assertionFields} }
      byDispute: assertions(where: { disputeHash: "${txHash}" }, first: 100) { ${assertionFields} }
      bySettlement: assertions(where: { settlementHash: "${txHash}" }, first: 100) { ${assertionFields} }
    }
  `;
  const result = await request<Record<string, OOV3GraphEntity[]>>(url, query);

  const seen = new Set<string>();
  const entities: OOV3GraphEntity[] = [];
  for (const list of Object.values(result)) {
    if (!Array.isArray(list)) continue;
    for (const entity of list) {
      if (!seen.has(entity.id)) {
        seen.add(entity.id);
        entities.push(entity);
      }
    }
  }
  return entities;
}
