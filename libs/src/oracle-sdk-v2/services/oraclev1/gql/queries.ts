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

export async function getPriceRequests(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName);
  const result = await fetchAllRequests(url, queryName, oracleType);
  return result;
}

export async function* getPriceRequestsIncremental(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName);
  // Iterate over the async generator from fetchAllRequests
  for await (const requests of fetchAllRequestsIncremental(
    url,
    queryName,
    oracleType,
  )) {
    // Yield each batch of requests
    yield requests;
  }
}
async function* fetchAllRequestsIncremental(
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  let skip = 0;
  const first = 500;
  let lastTime: number | undefined = undefined;

  while (true) {
    // Determine if we should use skip or time-based pagination
    const query =
      lastTime === undefined
        ? makeQuery(queryName, oracleType, first, skip)
        : makeTimeBasedQuery(queryName, oracleType, first, lastTime);

    const requests = await fetchPriceRequests(url, query);

    if (requests.length === 0) {
      yield [];
      break; // No more data to fetch
    }

    yield requests; // Yield the batch of requests

    if (lastTime === undefined) {
      skip += first;

      // Switch to time-based pagination if skip exceeds 5000
      if (skip >= 5000) {
        lastTime = Number(requests[requests.length - 1].time);
      }
    } else {
      // Update lastTime to the latest time in the batch
      lastTime = Number(requests[requests.length - 1].time);
    }
  }
}
async function fetchAllRequests(
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
  let skip = 0;
  const first = 1000;
  let requests = await fetchPriceRequests(
    url,
    makeQuery(queryName, oracleType, first, skip),
  );

  // thegraph wont allow skip > 5000,
  while (requests.length > 0 && skip < 5000) {
    result.push(...requests);
    skip += first;
    requests = await fetchPriceRequests(
      url,
      makeQuery(queryName, oracleType, first, skip),
    );
  }

  // have to use time based logic after we run out of skip size
  while (requests.length === first) {
    result.push(...requests);
    const lastTime = requests[requests.length - 1].time;
    requests = await fetchPriceRequests(
      url,
      makeTimeBasedQuery(queryName, oracleType, first, Number(lastTime)),
    );
  }

  result.push(...requests);

  return result;
}

async function fetchPriceRequests(url: string, query: string) {
  const result = await request<
    PriceRequestsQuery | { errors: { message: string }[] }
  >(url, query);
  if ("errors" in result) {
    throw new Error(result.errors[0].message);
  }
  return result.optimisticPriceRequests;
}

function makeQuery(
  queryName: string,
  oracleType: OracleType,
  first: number,
  skip: number,
) {
  const query = gql`
  query ${queryName} {
    optimisticPriceRequests(orderBy: time, orderDirection: desc, first: ${first}, skip: ${skip}) {
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
          ? `
            customLiveness
            bond
            eventBased
            `
          : ""
      }
      ${
        oracleType === "Skinny Optimistic Oracle"
          ? `
            customLiveness
            bond
            `
          : ""
      }
    }
  }
`;

  return query;
}

function makeTimeBasedQuery(
  queryName: string,
  oracleType: OracleType,
  first: number,
  lastTime: number,
) {
  const query = gql`
  query ${queryName} {
    optimisticPriceRequests(orderBy: time, orderDirection: desc, first: ${first}, where: { time_lt: ${lastTime}}) {
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
          ? `
            customLiveness
            bond
            eventBased
            `
          : ""
      }
      ${
        oracleType === "Skinny Optimistic Oracle"
          ? `
            customLiveness
            bond
            `
          : ""
      }
    }
  }
`;

  return query;
}

export async function getRecentProposals(
  url: string,
  chainId: ChainId,
  oracleType: OracleType,
  daysBack: number = 7,
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName) + "RecentProposals";
  const cutoffTime = Math.floor(Date.now() / 1000) - daysBack * 24 * 60 * 60;

  const result = await fetchRecentProposals(
    url,
    queryName,
    oracleType,
    cutoffTime,
  );
  return result;
}

function makeRecentProposalsQuery(
  queryName: string,
  oracleType: OracleType,
  first: number,
  cutoffTime: number,
  lastProposalTime?: number,
) {
  const whereClause = lastProposalTime
    ? `where: { proposalTimestamp_gt: "${cutoffTime}", proposalTimestamp_lt: "${lastProposalTime}", proposalTimestamp_not: null }`
    : `where: { proposalTimestamp_gt: "${cutoffTime}", proposalTimestamp_not: null }`;

  const query = gql`
  query ${queryName} {
    optimisticPriceRequests(
      orderBy: proposalTimestamp,
      orderDirection: desc,
      first: ${first},
      ${whereClause}
    ) {
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
          ? `customLiveness bond eventBased`
          : ""
      }
      ${oracleType === "Skinny Optimistic Oracle" ? `customLiveness bond` : ""}
    }
  }
  `;
  return query;
}

async function fetchRecentProposals(
  url: string,
  queryName: string,
  oracleType: OracleType,
  cutoffTime: number,
) {
  const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
  const first = 1000;
  let lastProposalTime: number | undefined = undefined;

  let requests = await fetchPriceRequests(
    url,
    makeRecentProposalsQuery(queryName, oracleType, first, cutoffTime),
  );

  while (requests.length === first) {
    result.push(...requests);
    lastProposalTime = Number(requests[requests.length - 1].proposalTimestamp);
    requests = await fetchPriceRequests(
      url,
      makeRecentProposalsQuery(
        queryName,
        oracleType,
        first,
        cutoffTime,
        lastProposalTime,
      ),
    );
  }

  result.push(...requests);
  return result;
}
