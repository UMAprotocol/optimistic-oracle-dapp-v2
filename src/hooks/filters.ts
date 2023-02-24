import type {
  CheckboxItems,
  CheckboxItemsByFilterName,
  CheckboxState,
  CheckedChangePayload,
  CheckedFiltersByFilterName,
  FilterCheckboxes,
  FilterName,
  OracleQueryUI,
} from "@/types";
import { cloneDeep } from "lodash";
import { useEffect, useReducer } from "react";

type State = {
  filters: CheckboxItemsByFilterName;
  checkedFilters: CheckedFiltersByFilterName;
  filteredQueries: OracleQueryUI[];
};

type Action = CountEntries | CheckedChange | Reset;

type CountEntries = {
  type: "count-entries";
};

type Reset = {
  type: "reset";
};

type CheckedChange = {
  type: "checked-change";
  payload: CheckedChangePayload;
};

export function useFilters({ queries }: { queries: OracleQueryUI[] }) {
  const initialState: State = {
    filters: {
      project: makeFilterCheckboxItems("project"),
      chainName: makeFilterCheckboxItems("chainName"),
      oracleType: makeFilterCheckboxItems("oracleType"),
    },
    checkedFilters: {
      project: [],
      chainName: [],
      oracleType: [],
    },
    filteredQueries: cloneDeep(queries),
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "count-entries" });
  }, [queries]);

  function reducer(state: State, action: Action) {
    switch (action.type) {
      case "count-entries": {
        const newState = cloneDeep(state);

        queries.forEach((query) => {
          const { project, chainName, oracleType } = query;

          newState.filters.project.All.count++;
          newState.filters.project[project].count++;

          newState.filters.chainName.All.count++;
          newState.filters.chainName[chainName].count++;

          newState.filters.oracleType.All.count++;
          newState.filters.oracleType[oracleType].count++;
        });

        return newState;
      }
      case "checked-change": {
        const newState = cloneDeep(state);

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
        newState.filteredQueries = makeFilteredQueries(newState);

        return newState;
      }
      case "reset": {
        const newState = cloneDeep(state);

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
        newState.filteredQueries = makeFilteredQueries(newState);

        return newState;
      }
      default:
        return state;
    }
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

      newItems["All"].checked = true;

      return newItems;
    }

    // if we are unchecking the only remaining checked item, check all
    if (!checked && isTheOnlyItemChecked(itemName, items)) {
      newItems[itemName].checked = false;
      newItems["All"].checked = true;

      return newItems;
    }

    // if we are checking an item, uncheck all
    newItems["All"].checked = false;
    newItems[itemName].checked = checked;

    return newItems;
  }

  function makeCheckedFilters(state: State) {
    return Object.entries(state.filters).reduce((acc, [filterName, filter]) => {
      const checkedOptions = Object.entries(filter).reduce(
        (acc, [optionName, option]) => {
          if (option.checked && optionName !== "All") {
            acc.push(optionName);
          }
          return acc;
        },
        [] as string[]
      );
      acc[filterName as FilterName] = checkedOptions;
      return acc;
    }, {} as CheckedFiltersByFilterName);
  }

  function makeFilteredQueries({ checkedFilters }: State) {
    const result = [];

    for (const query of queries) {
      let passes = true;

      for (const [filter, values] of Object.entries(checkedFilters)) {
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

  function makeFilterCheckboxItems(filterName: FilterName) {
    const filterOptions = queries.reduce((acc, query) => {
      const filterValue = query[filterName];

      if (typeof filterValue === "string" && !acc[filterValue]) {
        acc[filterValue] = { checked: false, count: 0 };
      }

      return acc;
    }, {} as FilterCheckboxes);

    return {
      All: { checked: true, count: 0 },
      ...filterOptions,
    } as CheckboxItems;
  }

  function isTheOnlyItemChecked(itemName: string, items: CheckboxItems) {
    return (
      Object.entries(items).filter(
        ([key, { checked }]) => key !== itemName && checked
      ).length === 0
    );
  }

  return {
    filters: state.filters,
    checkedFilters: state.checkedFilters,
    filteredQueries: state.filteredQueries,
    onCheckedChange(payload: CheckedChangePayload) {
      dispatch({ type: "checked-change", payload });
    },
    reset() {
      dispatch({ type: "reset" });
    },
  };
}
