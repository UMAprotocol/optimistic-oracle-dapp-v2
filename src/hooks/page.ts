import { useFilterAndSearch, useOracleDataContext } from "@/hooks";
import type { PageName } from "@shared/types";

type FilterState = ReturnType<typeof useFilterAndSearch>;
type PageState = FilterState & { name: PageName; isLoading: boolean };
export function usePage(name: PageName): PageState {
  const { settled, propose, verify } = useOracleDataContext();
  const queries =
    name === "verify"
      ? verify
      : name === "propose"
      ? propose
      : name === "settled"
      ? settled
      : undefined;
  const filterAndSearch = useFilterAndSearch(queries);
  const isLoading = queries === undefined;

  return {
    name,
    isLoading,
    ...filterAndSearch,
  };
}
