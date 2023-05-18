import { chainsById } from "@shared/constants";
import type {
  ChainId,
  ErrorMessage,
  OOV3GraphEntity,
  OOV3GraphQuery,
} from "@shared/types";
import { makeQueryName } from "@shared/utils";
import request, { gql } from "graphql-request";

export async function getAssertions(
  url: string,
  chainId: ChainId,
  addErrorMessage: (message: ErrorMessage) => void
) {
  try {
    const chainName = chainsById[chainId];
    const queryName = makeQueryName("Optimistic Oracle V3", chainName);
    const result = await fetchAllAssertions(url, queryName);
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

async function fetchAllAssertions(url: string, queryName: string) {
  const result: OOV3GraphEntity[] = [];
  let skip = 0;
  const first = 1000;
  let assertions = await fetchAssertions(
    url,
    makeQuery(queryName, first, skip)
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
