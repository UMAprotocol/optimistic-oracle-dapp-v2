import { useMemo } from "react";
import { useOracleDataContext, usePageContext } from "./contexts";

export function useQueries() {
  const { page } = usePageContext();
  const { verify = [], propose = [], settled = [] } = useOracleDataContext();
  const forPages = { verify, propose, settled };
  const all = useMemo(
    () => [...verify, ...propose, ...settled],
    [propose, settled, verify],
  );

  const forCurrentPage = forPages[page];

  return useMemo(
    () => ({
      all,
      forCurrentPage,
    }),
    [all, forCurrentPage],
  );
}

export function useQueryWithId(id: string | undefined) {
  const { all } = useQueries();
  return useMemo(() => {
    return all.find((query) => query.id === id);
  }, [all, id]);
}
