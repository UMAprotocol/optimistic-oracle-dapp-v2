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

function incrementAfterTimeout(
  remainingConcurrentRequests: { num: number },
  count: number,
  timeout: number = 1000,
) {
  setTimeout(() => {
    remainingConcurrentRequests.num += 1;
  }, timeout);
}

async function getResults(
  fromTime: number,
  toTime: number,
  maxSplits: number,
  remainingConcurrentRequests: { num: number },
  oracleType: OracleType,
  queryName: string,
  url: string,
): Promise<OOV1GraphEntity[] | OOV2GraphEntity[]> {
  const numSplits = Math.min(maxSplits, remainingConcurrentRequests.num);
  while (remainingConcurrentRequests.num <= 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  remainingConcurrentRequests.num -= numSplits;
  incrementAfterTimeout(remainingConcurrentRequests, numSplits);
  const size = (toTime - fromTime) / numSplits;

  const outputs = await Promise.all(
    Array.from({ length: numSplits }, (_, i) => [
      Math.round(fromTime + i * size),
      Math.round(fromTime + (i + 1) * size),
    ]).map(async ([fromTime, toTime]) => {
      console.log("matt fetching", fromTime, toTime);
      incrementAfterTimeout(remainingConcurrentRequests, 1);
      const requests = (
        await fetchPriceRequests(
          url,
          makeTimeBasedQuery(queryName, oracleType, 1000, toTime),
        )
      ).filter((request) => Number(request.time) >= fromTime);
      if (requests.length < 1000) {
        return requests;
      } else {
        const newToTime = Math.round(
          Number(requests[requests.length - 1].time),
        );
        const newMaxSplits = Math.max(
          Math.ceil((toTime - fromTime) / newToTime - fromTime) - 1,
          1,
        );
        return [
          ...requests,
          ...(await getResults(
            fromTime,
            newToTime,
            newMaxSplits,
            remainingConcurrentRequests,
            oracleType,
            queryName,
            url,
          )),
        ];
      }
    }),
  );
  return outputs.flat();
}

const maxConcurrentRequests = 10;

// async function fetchAllRequests(
//   url: string,
//   queryName: string,
//   oracleType: OracleType
// ) {
//   return await getResults(
//     1577836800,
//     Math.round(Date.now() / 1000),
//     maxConcurrentRequests,
//     { num: maxConcurrentRequests },
//     oracleType,
//     queryName,
//     url
//   );
// }

async function fetchAllRequests(
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  const first = 1000;

  const result = (
    await Promise.all(
      Array.from({ length: 5 }, (_, i) => {
        return fetchPriceRequests(
          url,
          makeQuery(queryName, oracleType, first, i * first),
        );
      }),
    )
  ).flat();

  if (result.length < 5000) {
    return result;
  }

  const lastTime = Number(result[result.length - 1].time);

  const timeResults = await getResults(
    lastTime,
    Math.round(Date.now() / 1000),
    maxConcurrentRequests,
    { num: maxConcurrentRequests },
    oracleType,
    queryName,
    url,
  );

  return [...timeResults, ...result.reverse()];
}

async function fetchPriceRequests(url: string, query: string) {
  let result: PriceRequestsQuery | { errors: { message: string }[] };
  try {
    result = await request<
      PriceRequestsQuery | { errors: { message: string }[] }
    >(url, query);
  } catch (error) {
    console.error("matt error", error);
    throw error;
  }
  if ("errors" in result) {
    console.error("matt errors", result.errors);
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
    optimisticPriceRequests(orderBy: time, orderDirection: asc, first: ${first}, skip: ${skip}) {
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
  console.log("matt making time based query", lastTime);
  const query = gql`
  query ${queryName} {
    optimisticPriceRequests(orderBy: time, orderDirection: desc, first: ${first}, where: { time_lt: ${Math.round(
      lastTime,
    )}}) {
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
