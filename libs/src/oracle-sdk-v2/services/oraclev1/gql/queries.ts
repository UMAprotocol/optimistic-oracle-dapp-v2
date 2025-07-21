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
  remainingConcurrentRequests.num -= numSplits;
  const size = (toTime - fromTime) / numSplits;

  const outputs = await Promise.all(
    Array.from({ length: numSplits }, (_, i) => [
      fromTime + i * size,
      fromTime + (i + 1) * size,
    ]).map(async ([fromTime, toTime]) => {
      const requests = (
        await fetchPriceRequests(
          url,
          makeTimeBasedQuery(queryName, oracleType, 1000, toTime),
        )
      ).filter((request) => Number(request.time) >= fromTime);
      remainingConcurrentRequests.num += 1;
      if (requests.length < 1000) {
        return requests;
      } else {
        const newToTime = Number(requests[requests.length - 1].time);
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

const maxConcurrentRequests = 50;

async function fetchAllRequests(
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  return await getResults(
    1577836800,
    Math.round(Date.now() / 1000),
    maxConcurrentRequests,
    { num: maxConcurrentRequests },
    oracleType,
    queryName,
    url,
  );
}

// async function fetchAllRequests(
//   url: string,
//   queryName: string,
//   oracleType: OracleType
// ) {
//   const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
//   let skip = 0;
//   const first = 1000;
//   let requests = await fetchPriceRequests(
//     url,
//     makeQuery(queryName, oracleType, first, skip)
//   );

//   // thegraph wont allow skip > 5000,
//   while (requests.length > 0 && skip < 5000) {
//     result.push(...requests);
//     skip += first;
//     requests = await fetchPriceRequests(
//       url,
//       makeQuery(queryName, oracleType, first, skip)
//     );
//   }

//   // have to use time based logic after we run out of skip size
//   while (requests.length === first) {
//     result.push(...requests);
//     const lastTime = requests[requests.length - 1].time;
//     requests = await fetchPriceRequests(
//       url,
//       makeTimeBasedQuery(queryName, oracleType, first, Number(lastTime))
//     );
//   }

//   result.push(...requests);

//   return result;
// }

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
        oracleType === "Optimistic Oracle V2"
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
        oracleType === "Optimistic Oracle V2"
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
