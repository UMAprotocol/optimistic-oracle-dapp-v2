import { chainsById } from "@shared/constants";
import type {
  ChainId,
  ErrorMessage,
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
  addErrorMessage: (message: ErrorMessage) => void
) {
  try {
    const chainName = chainsById[chainId];
    const queryName = makeQueryName(oracleType, chainName);
    const isV2 = oracleType === "Optimistic Oracle V2";
    const result = await fetchAllRequests(url, queryName, isV2);
    return result;
  } catch (e) {
    addErrorMessage({
      text: "TheGraph is experiencing downtime. Please use the legacy dapp while they rectify the issue",
      link: {
        text: "Legacy Dapp",
        href: "https://legacy.oracle.uma.xyz",
      },
    });
    return [];
  }
}

async function fetchAllRequests(url: string, queryName: string, isV2: boolean) {
  const result: (OOV1GraphEntity | OOV2GraphEntity)[] = [];
  let skip = 0;
  const first = 1000;
  let requests = await fetchPriceRequests(
    url,
    makeQuery(queryName, isV2, first, skip)
  );
  while (requests.length > 0) {
    result.push(...requests);
    skip += first;
    requests = await fetchPriceRequests(
      url,
      makeQuery(queryName, isV2, first, skip)
    );
  }
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
