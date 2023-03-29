import { emptyCheckedFilters, emptyFilters } from "@/constants";
import { determinePage } from "@/helpers";
import { useFilterAndSearch, useOracleDataContext } from "@/hooks";
import type {
  CheckboxItemsByFilterName,
  CheckedChangePayload,
  CheckedFiltersByFilterName,
  OracleQueryUI,
} from "@/types";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext } from "react";

export interface FilterAndSearchContextState {
  results: OracleQueryUI[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  filters: CheckboxItemsByFilterName;
  checkedFilters: CheckedFiltersByFilterName;
  onCheckedChange: (payload: CheckedChangePayload) => void;
  reset: () => void;
}

export const defaultFilterAndSearchContextState: FilterAndSearchContextState = {
  results: [],
  searchTerm: "",
  setSearchTerm: () => null,
  filters: {
    ...emptyFilters,
  },
  checkedFilters: {
    ...emptyCheckedFilters,
  },
  onCheckedChange: () => null,
  reset: () => null,
};

export const FilterAndSearchContext = createContext(
  defaultFilterAndSearchContextState
);

export function FilterAndSearchProvider({ children }: { children: ReactNode }) {
  const { settled, propose, verify } = useOracleDataContext();
  const router = useRouter();
  const pathname = router.pathname;
  const page = determinePage(pathname);
  const queries =
    page === "verify"
      ? verify
      : page === "propose"
      ? propose
      : page === "settled"
      ? settled
      : undefined;
  const filterAndSearchState = useFilterAndSearch(queries);

  return (
    <FilterAndSearchContext.Provider value={filterAndSearchState}>
      {children}
    </FilterAndSearchContext.Provider>
  );
}
