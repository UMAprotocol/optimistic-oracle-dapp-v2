import { useOracleDataContext, usePageContext } from "./contexts";

export function useQueries() {
  const { page } = usePageContext();
  const { verify = [], propose = [], settled = [] } = useOracleDataContext();
  const forPages = { verify, propose, settled };
  const all = [...verify, ...propose, ...settled];

  const forCurrentPage = forPages[page];

  return {
    all,
    forCurrentPage,
  };
}
