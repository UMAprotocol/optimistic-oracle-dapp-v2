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
  oracleType: OracleType
) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName(oracleType, chainName);
  const isV2 = oracleType === "Optimistic Oracle V2";
  const result = await fetchAllRequests(url, queryName, isV2);
  return result;
}

async function fetchAllRequests(url: string, queryName: string, isV2: boolean) {
  const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
  let skip = 0;
  const first = 1000;
  let requests = await fetchPriceRequests(
    url,
    makeQuery(queryName, isV2, first, skip)
  );

  // thegraph wont allow skip > 5000,
  while (requests.length > 0 && skip < 5000) {
    result.push(...requests);
    skip += first;
    requests = await fetchPriceRequests(
      url,
      makeQuery(queryName, isV2, first, skip)
    );
  }
  
  // have to use time based logic after we run out of skip size
  while (requests.length === first) {
    result.push(...requests);
    const lastTime = requests[requests.length-1].time;
    requests = await fetchPriceRequests(
      url,
      makeTimeBasedQuery(queryName,isV2,first,Number(lastTime))
    )
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
  isV2: boolean,
  first: number,
  skip: number
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
        isV2
          ? `
            customLiveness
            bond
            eventBased
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
  isV2: boolean,
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
        isV2
          ? `
            customLiveness
            bond
            eventBased
            `
          : ""
      }
    }
  }
`;

  return query;
}
