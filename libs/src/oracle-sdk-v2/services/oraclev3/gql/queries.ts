import { chainsById } from "@shared/constants";
import type { ChainId, OOV3GraphEntity, OOV3GraphQuery } from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

export async function getAssertions(url: string, chainId: ChainId) {
  const chainName = chainsById[chainId];
  const queryName = makeQueryName("Optimistic Oracle V3", chainName);
  const result = await fetchAllAssertions(url, queryName);
  return result;
}

async function fetchAllAssertions(url: string, queryName: string) {
  const result: OOV3GraphEntity[] = [];
  let skip = 0;
  const first = 500;
  let assertions = await fetchAssertions(
    url,
    makeQuery(queryName, first, skip),
  );

  while (assertions.length > 0) {
    result.push(...assertions);
    skip += first;
    assertions = await fetchAssertions(url, makeQuery(queryName, first, skip));
  }

  return result;
}

async function fetchAssertions(url: string, query: string) {
  const result = await request<OOV3GraphQuery>(url, query);
  return result.assertions;
}

function makeQuery(queryName: string, first: number, skip: number) {
  const query = gql`
  query ${queryName} {
    assertions(first: ${first}, skip: ${skip}) {
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
      settlementLogIndex
    }
  }
`;

  return query;
}

export async function getRecentAssertions(
  url: string,
  chainId: ChainId,
  daysBack: number = 7,
) {
  const chainName = chainsById[chainId];
  const queryName =
    makeQueryName("Optimistic Oracle V3", chainName) + "RecentAssertions";
  const cutoffTime = Math.floor(Date.now() / 1000) - daysBack * 24 * 60 * 60;

  const result = await fetchRecentAssertions(url, queryName, cutoffTime);
  return result;
}

function makeRecentAssertionsQuery(
  queryName: string,
  first: number,
  cutoffTime: number,
  lastAssertionTime?: number,
) {
  const whereClause = lastAssertionTime
    ? `where: { assertionTimestamp_gt: "${cutoffTime}", assertionTimestamp_lt: "${lastAssertionTime}" }`
    : `where: { assertionTimestamp_gt: "${cutoffTime}" }`;

  const query = gql`
  query ${queryName} {
    assertions(
      orderBy: assertionTimestamp,
      orderDirection: desc,
      first: ${first},
      ${whereClause}
    ) {
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
      settlementLogIndex
    }
  }
  `;
  return query;
}

async function fetchRecentAssertions(
  url: string,
  queryName: string,
  cutoffTime: number,
) {
  const result: OOV3GraphEntity[] = [];
  const first = 500;
  let lastAssertionTime: number | undefined = undefined;

  let assertions = await fetchAssertions(
    url,
    makeRecentAssertionsQuery(queryName, first, cutoffTime),
  );

  while (assertions.length === first) {
    result.push(...assertions);
    lastAssertionTime = Number(
      assertions[assertions.length - 1].assertionTimestamp,
    );
    assertions = await fetchAssertions(
      url,
      makeRecentAssertionsQuery(
        queryName,
        first,
        cutoffTime,
        lastAssertionTime,
      ),
    );
  }

  result.push(...assertions);
  return result;
}
