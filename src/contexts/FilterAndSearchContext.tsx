import { emptyCheckedFilters, emptyFilters } from "@/constants";
import { useFilterAndSearch, useQueriesCurrentForPage } from "@/hooks";
import type {
  CheckboxItemsByFilterName,
  CheckedChangePayload,
  CheckedFiltersByFilterName,
  OracleQueryUI,
} from "@/types";
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
  const queries = useQueriesCurrentForPage();
  const filterAndSearchState = useFilterAndSearch(queries);

  return (
    <FilterAndSearchContext.Provider value={filterAndSearchState}>
      {children}
    </FilterAndSearchContext.Provider>
  );
}
