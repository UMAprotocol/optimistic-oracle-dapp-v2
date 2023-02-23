import type { CheckboxItems, CheckboxState, OracleQueryUI } from "@/types";
import { cloneDeep } from "lodash";
import { useEffect, useReducer } from "react";

export function useFilters({ queries }: { queries: OracleQueryUI[] }) {
  const initialState = {
    filters: {
      project: {
        All: { checked: true, count: 0 },
        UMA: { checked: false, count: 0 },
        Polymarket: { checked: false, count: 0 },
        "Cozy Finance": { checked: false, count: 0 },
      },
      chainName: {
        All: { checked: true, count: 0 },
        "Unsupported Chain": { checked: false, count: 0 },
        Ethereum: { checked: false, count: 0 },
        Görli: { checked: false, count: 0 },
        Optimism: { checked: false, count: 0 },
        Gnosis: { checked: false, count: 0 },
        Polygon: { checked: false, count: 0 },
        Boba: { checked: false, count: 0 },
        SX: { checked: false, count: 0 },
        Avalanche: { checked: false, count: 0 },
        Arbitrum: { checked: false, count: 0 },
      },
      oracleType: {
        All: { checked: true, count: 0 },
        "Optimistic Oracle": { checked: false, count: 0 },
        "Optimistic Oracle V2": { checked: false, count: 0 },
        "Skinny Optimistic Oracle": { checked: false, count: 0 },
        "Optimistic Asserter": { checked: false, count: 0 },
      },
    },
    checkedFilters: {
      project: [] as string[],
      chainName: [] as string[],
      oracleType: [] as string[],
    },
    filteredQueries: cloneDeep(queries),
  };

  function makeFilteredQueries({ checkedFilters }: State) {
    const result = [];

    for (const query of queries) {
      let passes = true;

      for (const [filter, values] of Object.entries(checkedFilters)) {
        const _filter = filter as keyof typeof checkedFilters;
        if (values.length && !values.includes(query[_filter])) {
          passes = false;
        }
      }

      if (passes) {
        result.push(query);
      }
    }

    return result;
  }

  function makeListOfCheckedFilters(state: State) {
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
      acc[filterName] = checkedOptions;
      return acc;
    }, {} as Record<string, string[]>);
  }

  type State = typeof initialState;
  type CountEntries = {
    type: "count-entries";
  };
  type CheckedChange = {
    type: "checked-change";
    payload: {
      filter: keyof State["filters"];
      checked: CheckboxState;
      itemName: string;
    };
  };
  type Reset = {
    type: "reset";
  };
  type Action = CountEntries | CheckedChange | Reset;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "count-entries" });
  }, [queries]);

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

  function isTheOnlyItemChecked(itemName: string, items: CheckboxItems) {
    return (
      Object.entries(items).filter(
        ([key, { checked }]) => key !== itemName && checked
      ).length === 0
    );
  }

  function reducer(state: State, action: Action) {
    console.log({ state, action });
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
        const { filter, checked, itemName } = action.payload;
        const items = filters[filter];
        const newFilters = makeFilters({
          items,
          checked,
          itemName,
        });
        newState.filters[filter] = newFilters;
        newState.checkedFilters = makeListOfCheckedFilters(newState);
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
        newState.checkedFilters = makeListOfCheckedFilters(newState);
        newState.filteredQueries = makeFilteredQueries(newState);
        return newState;
      }
      default:
        return state;
    }
  }

  return {
    filters: state.filters,
    checkedFilters: state.checkedFilters,
    filteredQueries: state.filteredQueries,
    onCheckedChange: (payload: CheckedChange["payload"]) =>
      dispatch({ type: "checked-change", payload }),
    reset: () => dispatch({ type: "reset" }),
  };
}
