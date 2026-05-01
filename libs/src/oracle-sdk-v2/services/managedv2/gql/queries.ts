import { chainsById } from "@shared/constants";
import type {
  ChainId,
  OOV1GraphEntity,
  OOV2GraphEntity,
  OracleType,
  PriceRequestsQuery,
  CustomBond,
  CustomLiveness,
} from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

// --- Shared helpers ---

async function fetchPriceRequests(url: string, query: string) {
  const result = await request<
    PriceRequestsQuery | { errors: { message: string }[] }
  >(url, query);
  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }
  return result.optimisticPriceRequests;
}

export const managedFields = `
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
      customLiveness
      bond
      eventBased`;

/**
 * Paginate through subgraph results using skip, then time-based cursor.
 * @param maxResults - stop paginating once this many results have been collected
 */
async function fetchAllMatching(
  url: string,
  queryBuilder: (first: number, skip: number) => string,
  timeQueryBuilder?: (first: number, lastTime: number) => string,
  maxResults = 5000,
) {
  const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
  let skip = 0;
  const first = 1000;
  let requests = await fetchPriceRequests(url, queryBuilder(first, skip));

  while (requests.length > 0 && skip < 5000 && result.length < maxResults) {
    result.push(...requests);
    skip += first;
    requests = await fetchPriceRequests(url, queryBuilder(first, skip));
  }

  if (
    timeQueryBuilder &&
    requests.length === first &&
    result.length < maxResults
  ) {
    while (requests.length === first && result.length < maxResults) {
      result.push(...requests);
      const lastTime = Number(requests[requests.length - 1].time);
      requests = await fetchPriceRequests(
        url,
        timeQueryBuilder(first, lastTime),
      );
    }
    if (result.length < maxResults) {
      result.push(...requests);
    }
  }

  return result;
}

// --- Verify: state in ["Proposed", "Disputed", "Expired"] ---

export async function getVerifyRequests(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName) + "VerifyRequests";

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      optimisticPriceRequests(
        orderBy: time, orderDirection: desc,
        first: ${first}, skip: ${skip},
        where: { state_in: ["Proposed", "Disputed", "Expired"] }
      ) { ${managedFields} }
    }
  `,
  );
}

// --- Propose: state == "Requested" ---

export async function getProposeRequests(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName) + "ProposeRequests";

  return fetchAllMatching(
    url,
    (first, skip) => gql`
      query ${queryName} {
        optimisticPriceRequests(
          orderBy: time, orderDirection: desc,
          first: ${first}, skip: ${skip},
          where: { state: "Requested" }
        ) { ${managedFields} }
      }
    `,
    (first, lastTime) => gql`
      query ${queryName} {
        optimisticPriceRequests(
          orderBy: time, orderDirection: desc,
          first: ${first},
          where: { state: "Requested", time_lt: ${lastTime} }
        ) { ${managedFields} }
      }
    `,
    Infinity,
  );
}

// --- Settled: state in ["Resolved", "Settled"] ---

export async function getSettledRequests(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
  maxResults?: number,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName) + "SettledRequests";

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      optimisticPriceRequests(
        orderBy: time, orderDirection: desc,
        first: ${first}, skip: ${skip},
        where: { state_in: ["Resolved", "Settled"] }
      ) { ${managedFields} }
    }
  `,
    undefined,
    maxResults,
  );
}

// --- Deeplink: lookup by transaction hash ---

export async function getRequestByHash(
  url: string,
  txHash: string,
  eventIndex?: number,
) {
  const exactMatchQueries =
    eventIndex !== undefined
      ? `
      byRequestExact: optimisticPriceRequests(where: { requestHash: "${txHash}", requestLogIndex: "${eventIndex}" }, first: 1) { ${managedFields} }
      byProposalExact: optimisticPriceRequests(where: { proposalHash: "${txHash}", proposalLogIndex: "${eventIndex}" }, first: 1) { ${managedFields} }
      byDisputeExact: optimisticPriceRequests(where: { disputeHash: "${txHash}", disputeLogIndex: "${eventIndex}" }, first: 1) { ${managedFields} }
      bySettlementExact: optimisticPriceRequests(where: { settlementHash: "${txHash}", settlementLogIndex: "${eventIndex}" }, first: 1) { ${managedFields} }`
      : "";
  const query = gql`
    query GetManagedRequestByHash {${exactMatchQueries}
      byRequest: optimisticPriceRequests(where: { requestHash: "${txHash}" }, first: 100) { ${managedFields} }
      byProposal: optimisticPriceRequests(where: { proposalHash: "${txHash}" }, first: 100) { ${managedFields} }
      byDispute: optimisticPriceRequests(where: { disputeHash: "${txHash}" }, first: 100) { ${managedFields} }
      bySettlement: optimisticPriceRequests(where: { settlementHash: "${txHash}" }, first: 100) { ${managedFields} }
    }
  `;
  const result = await request<
    Record<string, (OOV1GraphEntity | OOV2GraphEntity)[]>
  >(url, query);

  const seen = new Set<string>();
  const entities: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
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

// --- Custom bond/liveness lookups (used by panel) ---

export async function getCustomBondForRequest(
  url: string,
  requester: string,
  identifier: string,
  ancillaryData: string,
) {
  const query = gql`
    query GetCustomBond {
      customBonds(where: { requester: "${requester}", identifier: "${identifier}", ancillaryData: "${ancillaryData}" }) {
        id
        requester
        identifier
        ancillaryData
        customBond
      }
    }
  `;

  const result = await request<
    { customBonds: CustomBond[] } | { errors: { message: string }[] }
  >(url, query);

  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }

  return result?.customBonds?.[0] || null;
}

export async function getCustomLivenessForRequest(
  url: string,
  requester: string,
  identifier: string,
  ancillaryData: string,
) {
  const query = gql`
    query GetCustomLiveness {
      customLivenesses(where: { requester: "${requester}", identifier: "${identifier}", ancillaryData: "${ancillaryData}" }) {
        id
        requester
        identifier
        ancillaryData
        customLiveness
      }
    }
  `;

  const result = await request<
    { customLiveness: CustomLiveness[] } | { errors: { message: string }[] }
  >(url, query);

  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }

  return result?.customLiveness?.[0] || null;
}
