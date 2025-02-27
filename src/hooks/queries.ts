import { useMemo } from "react";
import { useOracleDataContext, usePageContext } from "./contexts";

export function useQueries() {
  const { page } = usePageContext();
  const state = useOracleDataContext();
  const forCurrentPage = state[page] ?? [];
  return { forCurrentPage, all: Object.values(state?.all ?? {}) };
}

export function useQueryById(id: string | undefined) {
  const { all } = useQueries();
  return useMemo(() => all.find((q) => q.id === id), [all, id]);
}
