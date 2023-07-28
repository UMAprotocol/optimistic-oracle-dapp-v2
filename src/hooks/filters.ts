import {
  emptyCheckedFilters,
  emptyFilters,
  filterNames,
  keys,
} from "@/constants";
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
import type { Draft, Immutable } from "immer";
import { castDraft, produce } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmerReducer } from "use-immer";
import { useDebounce } from "usehooks-ts";
import { useUrlBar } from "./useUrlBar";

/**
 * Combines the filter and search hooks
 * @returns results - the filtered and searched queries
 * @returns filterProps - the props for the filter checkboxes
 * @returns searchProps - the props for the search input
 */
export function useFilterAndSearch(queries: OracleQueryUI[] | undefined = []) {
  const { filteredQueries, ...filterProps } = useFilters(queries);
  const { results, ...searchProps } = useSearch(filteredQueries);

  return useMemo(
    () => ({
      results,
      ...filterProps,
      ...searchProps,
    }),
    [filterProps, results, searchProps],
  );
}

/**
 * Searches the provided queries based on search term
 */
export function useSearch(queries: Immutable<OracleQueryUI[]>) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { addSearchParam, removeSearchParam } = useUrlBar();

  const fuse = useMemo(() => {
    return new Fuse(queries, {
      keys,
      ignoreLocation: true,
      threshold: 0.3,
    });
  }, [queries]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      addSearchParam("search", debouncedSearchTerm);
    } else {
      removeSearchParam("search");
    }
  }, [addSearchParam, debouncedSearchTerm, removeSearchParam]);

  const results = useMemo(() => {
    if (!debouncedSearchTerm) return queries;
    return fuse.search(debouncedSearchTerm).map(({ item }) => item);
  }, [queries, fuse, debouncedSearchTerm]);

  return {
    results,
    searchTerm,
    setSearchTerm,
  };
}

type State = Immutable<{
  filters: CheckboxItemsByFilterName;
  checkedFilters: CheckedFiltersByFilterName;
  filteredQueries: OracleQueryUI[];
}>;

type Action = MakeEntries | CheckedChange | Reset | AddCheckedFilters;

type MakeEntries = {
  type: "make-entries";
};

type AddCheckedFilters = {
  type: "add-checked-filters";
  payload: CheckedFiltersByFilterName;
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
  const [state, dispatch] = useImmerReducer(
    filtersReducer(queries),
    initialState,
  );
  const { addSearchParam, removeSearchParam, removeSearchParams } = useUrlBar();

  useEffect(() => {
    dispatch({ type: "make-entries" });
  }, [queries, dispatch]);

  const onCheckedChange = useCallback(
    (payload: CheckedChangePayload) => {
      dispatch({ type: "checked-change", payload });

      const { filterName, checked, itemName } = payload;

      if (checked) {
        addSearchParam(filterName, itemName);
      }
      if (!checked) {
        removeSearchParam(filterName, itemName);
      }
    },
    [addSearchParam, dispatch, removeSearchParam],
  );

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
    removeSearchParams(...filterNames);
  }, [dispatch, removeSearchParams]);

  const overrideCheckedFilters = useCallback(
    (checkedFilters: CheckedFiltersByFilterName) => {
      dispatch({ type: "add-checked-filters", payload: checkedFilters });
    },
    [dispatch],
  );

  const { filters, checkedFilters, filteredQueries } = state;

  return useMemo(
    () => ({
      filters,
      checkedFilters,
      filteredQueries,
      onCheckedChange,
      reset,
      overrideCheckedFilters,
    }),
    [
      filters,
      checkedFilters,
      filteredQueries,
      onCheckedChange,
      reset,
      overrideCheckedFilters,
    ],
  );
}

function countQueriesForFilter(
  queries: Immutable<OracleQueryUI[]>,
  filter: Partial<Record<FilterName, string>>,
) {
  const [filterName, itemName] = Object.entries(filter)[0];
  return queries.filter((query) => query[filterName as FilterName] === itemName)
    .length;
}

function filtersReducer(queries: Immutable<OracleQueryUI[]>) {
  // use currying to capture queries
  return function reducer(draft: Draft<State>, action: Action) {
    switch (action.type) {
      case "make-entries": {
        filterNames.forEach((filterName) => {
          draft.filters[filterName].All.count = queries.length;
        });

        Object.values(draft.filters).forEach((filter) => {
          Object.entries(filter).forEach(([itemName, item]) => {
            if (itemName !== "All") {
              item.count = 0;
            }
          });
        });

        queries.forEach((query) => {
          filterNames.forEach((filterName) => {
            draft.filters[filterName][query[filterName]] = {
              checked:
                draft.filters[filterName][query[filterName]]?.checked ?? false,
              count: countQueriesForFilter(queries, {
                [filterName]: query[filterName],
              }),
            };
          });
        });

        draft.checkedFilters = makeCheckedFilters(draft);
        draft.filteredQueries = makeFilteredQueries(draft, queries);

        break;
      }
      case "checked-change": {
        const { filters } = draft;
        const { filterName, checked, itemName } = action.payload;
        const items = filters[filterName];
        const newFilters = makeFilters({
          items,
          checked,
          itemName,
        });

        draft.filters[filterName] = newFilters;
        draft.checkedFilters = makeCheckedFilters(draft);
        draft.filteredQueries = makeFilteredQueries(draft, queries);
        break;
      }
      case "reset": {
        Object.values(draft.filters).forEach((filter) => {
          Object.entries(filter).forEach(([itemName, item]) => {
            if (itemName === "All") {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        });

        draft.checkedFilters = makeCheckedFilters(draft);
        draft.filteredQueries = makeFilteredQueries(draft, queries);
        break;
      }
      case "add-checked-filters": {
        const { payload } = action;
        Object.entries(payload).forEach(([filterName, values]) => {
          const items = draft.filters[filterName as FilterName];
          const newFilters = produce(items, (draft) => {
            draft.All.checked = false;
            values.forEach((value) => {
              draft[value] = {
                checked: true,
                count: countQueriesForFilter(queries, {
                  [filterName]: value,
                }),
              };
            });
          });
          draft.filters[filterName as FilterName] = newFilters;
        });

        draft.checkedFilters = makeCheckedFilters(draft);
        draft.filteredQueries = makeFilteredQueries(draft, queries);
        break;
      }
      default:
        break;
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
  const hasItemsOtherThanAllChecked = Object.entries(items).some(
    ([name, { checked }]) => name !== "All" && !!checked,
  );

  if (itemName === "All") {
    // if all is checked, we cannot let the user uncheck it without having at least one other item checked
    if (!hasItemsOtherThanAllChecked) return items;

    // if all is checked, uncheck all other items
    return produce(items, (draft) => {
      Object.keys(draft).forEach((name) => {
        draft[name].checked = false;
      });

      draft.All.checked = true;
    });
  }

  // if we are unchecking the only remaining checked item, check all
  if (!checked && isTheOnlyItemChecked(itemName, items)) {
    return produce(items, (draft) => {
      draft[itemName].checked = false;
      draft.All.checked = true;
    });
  }

  // if we are checking an item, uncheck all
  return produce(items, (draft) => {
    draft.All.checked = false;
    draft[itemName].checked = checked;
  });
}

function makeCheckedFilters({ filters }: State) {
  return Object.entries(filters).reduce((acc, [filterName, items]) => {
    const checkedItems = Object.entries(items).reduce<string[]>(
      (acc, [itemName, option]) => {
        if (option.checked && itemName !== "All") {
          acc.push(itemName);
        }
        return acc;
      },
      [],
    );
    acc[filterName as FilterName] = checkedItems;
    return acc;
  }, {} as CheckedFiltersByFilterName);
}

function makeFilteredQueries(
  state: State,
  queries: Immutable<OracleQueryUI[]>,
) {
  const result: Draft<OracleQueryUI[]> = [];

  for (const query of queries) {
    let passes = true;

    for (const [filter, values] of Object.entries(state.checkedFilters)) {
      if (values.length && !values.includes(query[filter as FilterName])) {
        passes = false;
      }
    }

    if (passes) {
      result.push(castDraft(query));
    }
  }

  return result;
}

function isTheOnlyItemChecked(itemName: string, items: CheckboxItems) {
  return (
    Object.entries(items).filter(
      ([key, { checked }]) => key !== itemName && !!checked,
    ).length === 0
  );
}
