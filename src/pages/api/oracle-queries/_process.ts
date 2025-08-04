import type { Request, Assertion } from "@shared/types";
import type { OracleQueryUI } from "@/types";
import {
  requestToOracleQuery,
  assertionToOracleQuery,
} from "@/helpers/converters";
import { filterQueriesByPage } from "./_fetch";

interface ProcessOptions {
  page: string;
  limit: number;
  offset: number;
}

// Type guard to check if a query is a Request
function isRequest(query: Request | Assertion): query is Request {
  return "state" in query;
}

// Type guard to check if a query is an Assertion
function isAssertion(query: Request | Assertion): query is Assertion {
  return "assertionId" in query;
}

export function processQueries(
  rawData: { requests: Request[]; assertions: Assertion[] },
  options: ProcessOptions,
): OracleQueryUI[] {
  const { requests, assertions } = rawData;
  const { page, limit, offset } = options;

  // Filter queries by page type
  const filteredQueries = filterQueriesByPage(requests, assertions, page);

  // Convert to UI format
  const processedQueries: OracleQueryUI[] = [];

  for (const query of filteredQueries) {
    try {
      if (isRequest(query)) {
        // This is a Request
        const uiQuery = requestToOracleQuery(query);
        processedQueries.push(uiQuery);
      } else if (isAssertion(query)) {
        // This is an Assertion
        const uiQuery = assertionToOracleQuery(query);
        processedQueries.push(uiQuery);
      } else {
        console.warn("Unknown query type:", query);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      // Continue processing other queries
    }
  }

  // Sort by time (newest first)
  processedQueries.sort((a, b) => {
    const timeA = a.timeMilliseconds || 0;
    const timeB = b.timeMilliseconds || 0;
    return timeB - timeA;
  });

  // Apply pagination
  const paginatedQueries = processedQueries.slice(offset, offset + limit);

  return paginatedQueries;
}
