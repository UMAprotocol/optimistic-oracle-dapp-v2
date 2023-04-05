import { getPageForQuery } from "@/helpers";
import { usePageContext, usePanelContext, useQueries } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { find } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useHandleQueryInUrl() {
  const router = useRouter();
  const { openPanel, panelOpen } = usePanelContext();
  const { all: queries } = useQueries();
  const { page } = usePageContext();

  useEffect(() => {
    const hasQueryUrl = window.location.search !== "";

    if (!hasQueryUrl) return;

    const query = find<OracleQueryUI>(queries, router.query);

    if (query && !panelOpen) {
      const pageForQuery = getPageForQuery(query);

      if (pageForQuery !== page) {
        void redirectToCorrectPage();
      }

      void openPanel(query, false);

      async function redirectToCorrectPage() {
        await router.push({
          pathname: `/${pageForQuery}`,
          query: router.query,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, queries]);
}
