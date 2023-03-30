import {
  usePageContext,
  usePanelContext,
  useQueriesCurrentForPage,
} from "@/hooks";
import type { OracleQueryUI } from "@/types";
import filter from "lodash/filter";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useHandleQueryInUrl() {
  const router = useRouter();
  const { openPanel, panelOpen } = usePanelContext();
  const { page } = usePageContext();
  const queries = useQueriesCurrentForPage();

  useEffect(() => {
    const hasQueryUrl = Object.keys(router.query).length > 0;
    const queryResults: OracleQueryUI[] = filter<OracleQueryUI>(
      queries,
      router.query
    );
    if (hasQueryUrl && queryResults.length === 1 && !panelOpen) {
      openPanel(queryResults[0], page, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, queries]);
}
