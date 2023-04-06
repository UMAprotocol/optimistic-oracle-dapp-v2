import { getPageForQuery } from "@/helpers";
import { usePageContext, usePanelContext, useQueries } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { filter, find } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";

type SearchParams = {
  transactionHash?: string;
  eventIndex?: string;
};

export function useHandleQueryInUrl() {
  const router = useRouter();
  const { openPanel, panelOpen } = usePanelContext();
  const { all: queries } = useQueries();
  const { page } = usePageContext();

  useEffect(() => {
    const hasQueryUrl = window.location.search !== "";

    if (!hasQueryUrl) return;

    const searchParams = Object.fromEntries(
      new URLSearchParams(window.location.search)
    ) as SearchParams;

    const forTx = filter<OracleQueryUI>(queries, (query) => {
      return (
        query.requestHash === searchParams.transactionHash ||
        query.assertionHash === searchParams.transactionHash
      );
    });

    const hasMultipleForTx = forTx.length > 1;

    const query = hasMultipleForTx
      ? find<OracleQueryUI>(queries, (query) => {
          return (
            query.requestLogIndex === searchParams.eventIndex ||
            query.assertionLogIndex === searchParams.eventIndex
          );
        })
      : forTx[0];

    if (query && !panelOpen) {
      const pageForQuery = getPageForQuery(query);

      if (pageForQuery !== page) {
        void redirectToCorrectPage();
      }

      void openPanel(query, false);

      async function redirectToCorrectPage() {
        const pathname = `/${pageForQuery === "verify" ? "" : pageForQuery}`;
        await router.push({
          pathname,
          query: router.query,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, queries]);
}
