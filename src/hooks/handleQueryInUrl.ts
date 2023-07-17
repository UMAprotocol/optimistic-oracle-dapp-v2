import { getPageForQuery } from "@/helpers";
import { usePageContext, usePanelContext, useQueries } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { exists } from "@libs/utils";
import type { ChainId, OracleType } from "@shared/types";
import { filter, find, lowerCase } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const { setId, setPanelOpen } = usePanelContext();
  const { all: queries } = useQueries();
  const [foundQuery, setFoundQuery] = useState<OracleQueryUI | undefined>();
  const { page } = usePageContext();

  useEffect(() => {
    setPanelOpen(true);
  }, [setPanelOpen]);

  useEffect(() => {
    if (foundQuery) {
      const pageForQuery = getPageForQuery(foundQuery);

      if (pageForQuery !== page) {
        void redirectToCorrectPage();
      }

      setId(foundQuery.id);
      setFoundQuery(undefined);

      async function redirectToCorrectPage() {
        const pathname = `/${pageForQuery === "verify" ? "" : pageForQuery}`;
        await router.push(
          {
            pathname,
            query: router.query,
          },
          undefined,
          { scroll: false }
        );
      }
    }
  }, [foundQuery, page, router, setId]);

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
      new URLSearchParams(window.location.search)
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
        }
      );

      const hasMultipleForTx = forTx.length > 1;

      const query =
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
              }
            )
          : forTx[0];

      setFoundQuery(query);
      return;
    }

    if (isRequestDetails) {
      const query = find<OracleQueryUI>(queries, {
        chainId,
        identifier,
        requester: lowerCase(requester),
        oracleType: getOracleTypeFromOldOracleName(oracleType),
        timeUNIX: Number(timestamp),
        queryTextHex: ancillaryData,
      });
      setFoundQuery(query);
      return;
    }
  }, [queries]);
}

function getOracleTypeFromOldOracleName(
  oracleType: OldOracleTypeName
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
