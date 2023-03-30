import { useOracleDataContext, usePageContext } from "./contexts";

export function useQueriesCurrentForPage() {
  const { page } = usePageContext();
  const queries = useOracleDataContext();
  const queriesForPage = queries[page];

  return queriesForPage;
}
