import { config } from "@/constants";
import type { Request, Assertion } from "@shared/types";
import { oracles } from "@libs/oracle-sdk-v2/services";
import { Client } from "@libs/oracle-sdk-v2";

interface FetchOptions {
  page: string;
  chainId?: number;
  limit: number;
  offset: number;
  fromTimestamp?: string;
  toTimestamp?: string;
}

interface FetchResult {
  requests: Request[];
  assertions: Assertion[];
}

export async function fetchOracleQueries(
  options: FetchOptions,
): Promise<FetchResult> {
  const { chainId, fromTimestamp, toTimestamp } = options;

  // Filter subgraphs by chainId if specified
  const relevantSubgraphs = chainId
    ? config.subgraphs.filter((sg) => sg.chainId === chainId)
    : config.subgraphs;

  const oraclesServices = oracles.Factory(relevantSubgraphs);

  return new Promise((resolve, reject) => {
    const results: FetchResult = {
      requests: [],
      assertions: [],
    };

    // Create a temporary client to fetch data
    Client(oraclesServices, {
      requests: (requests: Request[]) => {
        // Filter requests by timestamp if provided
        let filteredRequests = requests;
        if (fromTimestamp && toTimestamp) {
          const fromTime = parseInt(fromTimestamp);
          const toTime = parseInt(toTimestamp);
          filteredRequests = requests.filter((request) => {
            const requestTime = parseInt(request.time);
            return requestTime >= fromTime && requestTime <= toTime;
          });
        }
        results.requests.push(...filteredRequests);
      },
      assertions: (assertions: Assertion[]) => {
        // Filter assertions by timestamp if provided
        let filteredAssertions = assertions;
        if (fromTimestamp && toTimestamp) {
          const fromTime = parseInt(fromTimestamp);
          const toTime = parseInt(toTimestamp);
          filteredAssertions = assertions.filter((assertion) => {
            const assertionTime = assertion.assertionTimestamp
              ? parseInt(assertion.assertionTimestamp)
              : 0;
            return assertionTime >= fromTime && assertionTime <= toTime;
          });
        }
        results.assertions.push(...filteredAssertions);
      },
      errors: (errors) => {
        if (errors.some((error) => error)) {
          reject(new Error("Failed to fetch oracle data"));
        }
      },
    });

    // Give the client some time to fetch data, then resolve
    setTimeout(() => {
      resolve(results);
    }, 5000); // 5 second timeout
  });
}

// Helper function to filter queries by page type
export function filterQueriesByPage(
  requests: Request[],
  assertions: Assertion[],
  page: string,
): (Request | Assertion)[] {
  const allQueries = [...requests, ...assertions];

  switch (page) {
    case "verify":
      return allQueries.filter((query) => {
        if ("state" in query) {
          return (
            query.state === "Proposed" ||
            query.state === "Disputed" ||
            query.state === "Expired"
          );
        }
        // For assertions, check if they can be disputed or settled
        return !("settlementHash" in query) || !query.settlementHash;
      });

    case "propose":
      return allQueries.filter((query) => {
        if ("state" in query) {
          return query.state === "Requested";
        }
        return false; // Assertions don't have a "propose" state
      });

    case "settled":
      return allQueries.filter((query) => {
        if ("state" in query) {
          return query.state === "Resolved";
        }
        // For assertions, check if they have been settled
        return "settlementHash" in query && query.settlementHash;
      });

    default:
      return allQueries;
  }
}
