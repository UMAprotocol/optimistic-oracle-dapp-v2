import { emptyCheckedFilters, emptyFilters, keys } from "@/constants";
import type {
  CheckboxItems,
  CheckboxItemsByFilterName,
  CheckboxState,
  CheckedChangePayload,
  CheckedFiltersByFilterName,
  FilterName,
  OracleQueryUI,
} from "@/types";
import Fuse from "fuse.js";
import { cloneDeep } from "lodash";
import { useEffect, useMemo, useReducer, useState } from "react";
import { useDebounce } from "usehooks-ts";

/**
 * Combines the filter and search hooks
 * @returns results - the filtered and searched queries
 * @returns filterProps - the props for the filter checkboxes
 * @returns searchProps - the props for the search input
 */
export function useFilterAndSearch(queries: OracleQueryUI[] | undefined = []) {
  const { filteredQueries, ...filterProps } = useFilters(queries);
  const { results, ...searchProps } = useSearch(filteredQueries);

  return {
    results,
    ...filterProps,
    ...searchProps,
  };
}

/**
 * Searches the provided queries based on search term
 */
export function useSearch(queries: OracleQueryUI[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fuse = useMemo(() => {
    return new Fuse(queries, {
      keys,
      ignoreLocation: true,
      threshold: 0.3,
    });
  }, [queries]);

  const results = useMemo(() => {
    if (!debouncedSearchTerm) return queries;
    const results = fuse.search(debouncedSearchTerm);
    return results.map((result) => result.item);
  }, [queries, fuse, debouncedSearchTerm]);

  return {
    results,
    searchTerm,
    setSearchTerm,
  };
}

type State = {
  filters: CheckboxItemsByFilterName;
  checkedFilters: CheckedFiltersByFilterName;
  filteredQueries: OracleQueryUI[];
};

type Action = MakeEntries | CheckedChange | Reset;

type MakeEntries = {
  type: "make-entries";
};

type Reset = {
  type: "reset";
};

type CheckedChange = {
  type: "checked-change";
  payload: CheckedChangePayload;
};

const initialState: State = {
  filters: {
    ...emptyFilters,
  },
  checkedFilters: {
    ...emptyCheckedFilters,
  },
  filteredQueries: [],
};

/**
 * Filter the queries based on the checked filters
 * @returns filters - state of the filter checkboxes
 * @returns checkedFilters - the checked filters in an array for rendering a list of checked filters
 * @returns filteredQueries - the filtered queries
 * @returns checkedChange - update the filters based on the checked state of a checkbox
 * @returns reset - reset the filters to their initial state
 */
export function useFilters(queries: OracleQueryUI[]) {
  const [state, dispatch] = useReducer(filtersReducer(queries), initialState);

  useEffect(() => {
    dispatch({ type: "make-entries" });
  }, [queries]);

  function onCheckedChange(payload: CheckedChangePayload) {
    dispatch({ type: "checked-change", payload });
  }

  function reset() {
    dispatch({ type: "reset" });
  }

  const { filters, checkedFilters, filteredQueries } = state;

  return {
    filters,
    checkedFilters,
    filteredQueries,
    onCheckedChange,
    reset,
  };
}

function countQueriesForFilter(
  queries: OracleQueryUI[],
  filter: Partial<{ [key in FilterName]: string }>
) {
  const [filterName, itemName] = Object.entries(filter)[0];
  return queries.filter((query) => query[filterName as FilterName] === itemName)
    .length;
}

function filtersReducer(queries: OracleQueryUI[]) {
  // use currying to capture queries
  return function reducer(oldState: State, action: Action) {
    switch (action.type) {
      case "make-entries": {
        const newState = cloneDeep(oldState);

        newState.filters.project.All.count = queries.length;
        newState.filters.chainName.All.count = queries.length;
        newState.filters.oracleType.All.count = queries.length;

        Object.values(newState.filters).forEach((filter) => {
          Object.entries(filter).forEach(([itemName, item]) => {
            if (itemName !== "All") {
              item.count = 0;
            }
          });
        });

        queries.forEach((query) => {
          const { project, chainName, oracleType } = query;

          newState.filters.project[project] = {
            checked: oldState.filters.project[project]?.checked ?? false,
            count: countQueriesForFilter(queries, { project }),
          };

          newState.filters.chainName[chainName] = {
            checked: oldState.filters.chainName[chainName]?.checked ?? false,
            count: countQueriesForFilter(queries, { chainName }),
          };

          newState.filters.oracleType[oracleType] = {
            checked: oldState.filters.oracleType[oracleType]?.checked ?? false,
            count: countQueriesForFilter(queries, { oracleType }),
          };
        });

        newState.checkedFilters = makeCheckedFilters(newState);
        newState.filteredQueries = makeFilteredQueries(newState, queries);

        return newState;
      }
      case "checked-change": {
        const newState = cloneDeep(oldState);
        const { filters } = newState;
        const { filterName, checked, itemName } = action.payload;
        const items = filters[filterName];
        const newFilters = makeFilters({
          items,
          checked,
          itemName,
        });

        newState.filters[filterName] = newFilters;
        newState.checkedFilters = makeCheckedFilters(newState);
        newState.filteredQueries = makeFilteredQueries(newState, queries);

        return newState;
      }
      case "reset": {
        const newState = cloneDeep(oldState);

        Object.values(newState.filters).forEach((filter) => {
          Object.entries(filter).forEach(([itemName, item]) => {
            if (itemName === "All") {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        });

        newState.checkedFilters = makeCheckedFilters(newState);
        newState.filteredQueries = makeFilteredQueries(newState, queries);

        return newState;
      }
      default:
        return oldState;
    }
  };
}

function makeFilters({
  items,
  checked,
  itemName,
}: {
  items: CheckboxItems;
  checked: CheckboxState;
  itemName: string;
}) {
  const newItems = cloneDeep(items);

  const hasItemsOtherThanAllChecked = Object.entries(items).some(
    ([name, { checked }]) => name !== "All" && checked
  );

  if (itemName === "All") {
    // if all is checked, we cannot let the user uncheck it without having at least one other item checked
    if (!hasItemsOtherThanAllChecked) return newItems;

    // if all is checked, uncheck all other items
    Object.keys(newItems).forEach((name) => {
      newItems[name].checked = false;
    });

    newItems.All.checked = true;

    return newItems;
  }

  // if we are unchecking the only remaining checked item, check all
  if (!checked && isTheOnlyItemChecked(itemName, items)) {
    newItems[itemName].checked = false;
    newItems.All.checked = true;

    return newItems;
  }

  // if we are checking an item, uncheck all
  newItems.All.checked = false;
  newItems[itemName].checked = checked;

  return newItems;
}

function makeCheckedFilters({ filters }: State) {
  return Object.entries(filters).reduce((acc, [filterName, items]) => {
    const checkedItems = Object.entries(items).reduce(
      (acc, [itemName, option]) => {
        if (option.checked && itemName !== "All") {
          acc.push(itemName);
        }
        return acc;
      },
      [] as string[]
    );
    acc[filterName as FilterName] = checkedItems;
    return acc;
  }, {} as CheckedFiltersByFilterName);
}

function makeFilteredQueries(state: State, queries: OracleQueryUI[]) {
  const result = [];

  for (const query of queries) {
    let passes = true;

    for (const [filter, values] of Object.entries(state.checkedFilters)) {
      if (values.length && !values.includes(query[filter as FilterName])) {
        passes = false;
      }
    }

    if (passes) {
      result.push(query);
    }
  }

  return result;
}

function isTheOnlyItemChecked(itemName: string, items: CheckboxItems) {
  return (
    Object.entries(items).filter(
      ([key, { checked }]) => key !== itemName && checked
    ).length === 0
  );
}
