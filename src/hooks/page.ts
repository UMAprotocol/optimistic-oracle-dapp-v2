import {
  useFilterAndSearch,
  useOracleDataContext,
  usePanelContext,
} from "@/hooks";
import { useEffect } from "react";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { useRouter } from "next/router";
import filter from "lodash/filter";

type FilterState = ReturnType<typeof useFilterAndSearch>;
type PageState = FilterState & {
  name: PageName;
  isLoading: boolean;
};
export function usePage(name: PageName): PageState {
  const { settled, propose, verify } = useOracleDataContext();
  const { query } = useRouter();
  const { openPanel, closePanel } = usePanelContext();
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
  // this is what drives opening and closing panels based on router,
  // there should only be one place that watches the url query params for changes
  // currently this is in the use page component
  useEffect(() => {
    const hasQueryUrl = Object.keys(query).length > 0;
    const queryResults: OracleQueryUI[] = filter<OracleQueryUI>(queries, query);
    if (hasQueryUrl && queryResults.length === 1) {
      openPanel(queryResults[0], name);
    } else {
      closePanel();
    }
  }, [query, openPanel, closePanel, name, queries]);

  return {
    name,
    isLoading,
    ...filterAndSearch,
  };
}
