import type { NextApiRequest, NextApiResponse } from "next";

import { fetchPriceRequests } from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import type {
  OOV1GraphEntity,
  OOV2GraphEntity,
  OracleType,
} from "@shared/types";

import { kv } from "@vercel/kv";
import { gql } from "graphql-request";

const CACHE_CHUNK_TIME = 60 * 60 * 24 * 30; // 30 days

async function cacheResult(
  key: string,
  result: (OOV1GraphEntity | OOV2GraphEntity)[],
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  await kv.set(key, JSON.stringify(result));
}

async function getCachedResult(key: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result = await kv.get(key);
  if (result === null || result === undefined) {
    return null;
  }
  return JSON.parse(result as string) as (OOV1GraphEntity | OOV2GraphEntity)[];
}

async function fetchAllRequests(
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  const first = 1000;
  const initialRequests = await fetchPriceRequests(
    url,
    makeQuery(queryName, oracleType, first, 0, "asc"),
  );

  if (initialRequests.length < 1000) {
    return initialRequests.reverse();
  }

  const startTime = Number(initialRequests[first - 1].time);
  const endTime = Math.floor(Date.now() / 1000);
  const numChunks = Math.ceil((endTime - startTime) / CACHE_CHUNK_TIME);

  const chunks = Array.from({ length: numChunks }, (_, i) => [
    startTime + i * CACHE_CHUNK_TIME,
    Math.min(startTime + (i + 1) * CACHE_CHUNK_TIME, endTime),
  ]);

  const results: (OOV1GraphEntity | OOV2GraphEntity)[] = initialRequests;
  // Intentionally not using Promise.all here to avoid too much concurrency.
  const chunksWithCachedResults = await Promise.all(
    chunks.map(
      async ([startTime, endTime]): Promise<
        [number, number, (OOV1GraphEntity | OOV2GraphEntity)[] | null]
      > => {
        const cacheKey = `${process.env.VERCEL_DEPLOYMENT_ID}-${url}-${queryName}-${oracleType}-${startTime}-${endTime}`;
        const cachedResult = await getCachedResult(cacheKey);
        return [startTime, endTime, cachedResult];
      },
    ),
  );

  for (const [startTime, endTime, cachedResult] of chunksWithCachedResults) {
    if (cachedResult) {
      results.push(...cachedResult);
      continue;
    }

    const cacheKey = `${url}-${queryName}-${oracleType}-${startTime}-${endTime}`;

    let queryStartTime = startTime;
    const chunkResults: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const requests = await fetchPriceRequests(
        url,
        makeTimeBasedQuery(
          queryName,
          oracleType,
          first,
          endTime,
          queryStartTime,
          "asc",
        ),
      );

      chunkResults.push(...requests);

      if (requests.length < first) {
        break;
      }
      queryStartTime = Number(requests[requests.length - 1].time);
    }

    if (endTime - startTime === CACHE_CHUNK_TIME) {
      await cacheResult(cacheKey, chunkResults);
    }

    results.push(...chunkResults);
  }

  return results;
}

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=60"); // Cache for 1 minute, reset on re-deployment.

  if (
    !_request.query.url ||
    !_request.query.queryName ||
    !_request.query.oracleType
  ) {
    response.status(400).send({
      message: "Missing required parameters",
    });
    return;
  }

  const requests = await fetchAllRequests(
    _request.query.url as string,
    _request.query.queryName as string,
    _request.query.oracleType as OracleType,
  );

  response.status(200).send(requests);
}

export const config = {
  api: {
    responseLimit: false,
  },
};

function makeQuery(
  queryName: string,
  oracleType: OracleType,
  first: number,
  skip: number,
  orderBy: "asc" | "desc" = "desc",
) {
  const query = gql`
    query ${queryName} {
      optimisticPriceRequests(orderBy: time, orderDirection: ${orderBy}, first: ${first}, skip: ${skip}) {
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

export function makeTimeBasedQuery(
  queryName: string,
  oracleType: OracleType,
  first: number,
  startTime: number,
  endTime: number,
  orderBy: "asc" | "desc" = "desc",
) {
  const query = gql`
    query ${queryName} {
      optimisticPriceRequests(orderBy: time, orderDirection: ${orderBy}, first: ${first}, where: { time_lte: ${endTime}}, time_gt: ${startTime}) {
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
