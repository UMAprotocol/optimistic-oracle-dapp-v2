import {
  useFilterAndSearch,
  useOracleDataContext,
  usePanelContext,
} from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import filter from "lodash/filter";
import { useRouter } from "next/router";
import { useEffect } from "react";

type FilterState = ReturnType<typeof useFilterAndSearch>;
type PageState = FilterState & {
  name: PageName;
  isLoading: boolean;
};
export function usePage(name: PageName): PageState {
  const { settled, propose, verify } = useOracleDataContext();
  const router = useRouter();
  const { openPanel, panelOpen } = usePanelContext();
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
    const hasQueryUrl = Object.keys(router.query).length > 0;
    const queryResults: OracleQueryUI[] = filter<OracleQueryUI>(
      queries,
      router.query
    );
    if (hasQueryUrl && queryResults.length === 1 && !panelOpen) {
      openPanel(queryResults[0], name, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, queries]);

  return {
    name,
    isLoading,
    ...filterAndSearch,
  };
}
