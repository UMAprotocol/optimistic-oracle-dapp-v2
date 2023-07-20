import { getPageForQuery } from "@/helpers";
import { usePageContext, usePanelContext, useQueries } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { ChainId, OracleType } from "@shared/types";
import { filter, find, lowerCase } from "lodash";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { exists } from "@libs/utils";

type HashAndIndexParams = {
  transactionHash?: string;
  eventIndex?: string;
};

type OldOracleTypeName = "Optimistic" | "OptimisticV2" | "Skinny";

type RequestDetailsParams = {
  chainId?: ChainId;
  oracleType?: OldOracleTypeName;
  requester?: string;
  timestamp?: string;
  identifier?: string;
  ancillaryData?: string;
};

type SearchParams = HashAndIndexParams & RequestDetailsParams;

export function useHandleQueryInUrl() {
  const router = useRouter();
  const { openPanel, panelOpen } = usePanelContext();
  const { all: queries } = useQueries();
  const { page } = usePageContext();

  useEffect(() => {
    const {
      transactionHash,
      eventIndex,
      chainId,
      oracleType,
      requester,
      timestamp,
      identifier,
      ancillaryData,
    } = Object.fromEntries(
      new URLSearchParams(window.location.search),
    ) as SearchParams;

    const hasHash = transactionHash;
    const isRequestDetails =
      chainId &&
      oracleType &&
      requester &&
      timestamp &&
      identifier &&
      ancillaryData;

    if (!hasHash && !isRequestDetails) return;

    let query: OracleQueryUI | undefined;

    if (hasHash) {
      const forTx = filter<OracleQueryUI>(
        queries,
        ({
          requestHash,
          proposalHash,
          disputeHash,
          settlementHash,
          assertionHash,
        }) => {
          return (
            requestHash === transactionHash ||
            proposalHash === transactionHash ||
            disputeHash === transactionHash ||
            settlementHash === transactionHash ||
            assertionHash === transactionHash
          );
        },
      );

      const hasMultipleForTx = forTx.length > 1;

      query =
        hasMultipleForTx && exists(eventIndex)
          ? find<OracleQueryUI>(
              forTx,
              ({
                requestLogIndex,
                proposalLogIndex,
                disputeLogIndex,
                settlementLogIndex,
                assertionLogIndex,
              }) => {
                return (
                  requestLogIndex === eventIndex ||
                  proposalLogIndex === eventIndex ||
                  disputeLogIndex === eventIndex ||
                  settlementLogIndex === eventIndex ||
                  assertionLogIndex === eventIndex
                );
              },
            )
          : forTx[0];
    }

    if (isRequestDetails) {
      query = find<OracleQueryUI>(queries, {
        chainId,
        identifier,
        requester: lowerCase(requester),
        oracleType: getOracleTypeFromOldOracleName(oracleType),
        timeUNIX: Number(timestamp),
        queryTextHex: ancillaryData,
      });
    }

    if (query && !panelOpen) {
      const pageForQuery = getPageForQuery(query);

      if (pageForQuery !== page) {
        void redirectToCorrectPage();
      }

      void openPanel(query, false);

      async function redirectToCorrectPage() {
        const pathname = `/${pageForQuery === "verify" ? "" : pageForQuery}`;
        await router.push(
          {
            pathname,
            query: router.query,
          },
          undefined,
          { scroll: false },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, queries]);
}

function getOracleTypeFromOldOracleName(
  oracleType: OldOracleTypeName,
): OracleType {
  switch (oracleType) {
    case "Optimistic":
      return "Optimistic Oracle V1";
    case "OptimisticV2":
      return "Optimistic Oracle V2";
    case "Skinny":
      return "Skinny Optimistic Oracle";
  }
}
