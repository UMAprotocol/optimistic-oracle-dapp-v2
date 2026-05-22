import { chainsById } from "@shared/constants";
import type {
  ChainId,
  OOV1GraphEntity,
  OOV2GraphEntity,
  OracleType,
  PriceRequestsQuery,
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

export function requestFields(oracleType: OracleType) {
  return `
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
        oracleType === "Optimistic Oracle V2" ||
        oracleType === "Managed Optimistic Oracle V2"
          ? "customLiveness bond eventBased"
          : ""
      }
      ${
        oracleType === "Skinny Optimistic Oracle" ? "customLiveness bond" : ""
      }`;
}

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

  // Time-based pagination after skip limit
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
  const fields = requestFields(oracleType);

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      optimisticPriceRequests(
        orderBy: time, orderDirection: desc,
        first: ${first}, skip: ${skip},
        where: { state_in: ["Proposed", "Disputed", "Expired"] }
      ) { ${fields} }
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
  const fields = requestFields(oracleType);

  return fetchAllMatching(
    url,
    (first, skip) => gql`
      query ${queryName} {
        optimisticPriceRequests(
          orderBy: time, orderDirection: desc,
          first: ${first}, skip: ${skip},
          where: { state: "Requested" }
        ) { ${fields} }
      }
    `,
    (first, lastTime) => gql`
      query ${queryName} {
        optimisticPriceRequests(
          orderBy: time, orderDirection: desc,
          first: ${first},
          where: { state: "Requested", time_lt: ${lastTime} }
        ) { ${fields} }
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
  const fields = requestFields(oracleType);

  return fetchAllMatching(
    url,
    (first, skip) => gql`
    query ${queryName} {
      optimisticPriceRequests(
        orderBy: time, orderDirection: desc,
        first: ${first}, skip: ${skip},
        where: { state_in: ["Resolved", "Settled"] }
      ) { ${fields} }
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
  oracleType: OracleType,
  eventIndex?: number,
) {
  const fields = requestFields(oracleType);
  // When eventIndex is provided, exact (hash + logIndex) matches deterministically
  // pinpoint the target entity even when a single tx contains many requests
  // (a batch). The broader hash-only queries below remain so proximity scoring
  // still works when eventIndex is missing or doesn't line up exactly.
  const exactMatchQueries =
    eventIndex !== undefined
      ? `
      byRequestExact: optimisticPriceRequests(where: { requestHash: "${txHash}", requestLogIndex: "${eventIndex}" }, first: 1) { ${fields} }
      byProposalExact: optimisticPriceRequests(where: { proposalHash: "${txHash}", proposalLogIndex: "${eventIndex}" }, first: 1) { ${fields} }
      byDisputeExact: optimisticPriceRequests(where: { disputeHash: "${txHash}", disputeLogIndex: "${eventIndex}" }, first: 1) { ${fields} }
      bySettlementExact: optimisticPriceRequests(where: { settlementHash: "${txHash}", settlementLogIndex: "${eventIndex}" }, first: 1) { ${fields} }`
      : "";
  const query = gql`
    query GetRequestByHash {${exactMatchQueries}
      byRequest: optimisticPriceRequests(where: { requestHash: "${txHash}" }, first: 100) { ${fields} }
      byProposal: optimisticPriceRequests(where: { proposalHash: "${txHash}" }, first: 100) { ${fields} }
      byDispute: optimisticPriceRequests(where: { disputeHash: "${txHash}" }, first: 100) { ${fields} }
      bySettlement: optimisticPriceRequests(where: { settlementHash: "${txHash}" }, first: 100) { ${fields} }
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

// --- Deeplink: lookup by request details (legacy) ---

export async function getRequestByDetails(
  url: string,
  params: {
    requester: string;
    time: string;
    identifier: string;
    ancillaryData: string;
  },
  oracleType: OracleType,
) {
  const fields = requestFields(oracleType);
  const query = gql`
    query GetRequestByDetails {
      optimisticPriceRequests(
        where: {
          requester: "${params.requester}",
          time: "${params.time}",
          identifier: "${params.identifier}",
          ancillaryData: "${params.ancillaryData}"
        },
        first: 1
      ) { ${fields} }
    }
  `;
  return fetchPriceRequests(url, query);
}
