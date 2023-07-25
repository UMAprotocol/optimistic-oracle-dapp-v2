import { usePageContext, usePanelContext, useQueries } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { exists } from "@libs/utils";
import type { ChainId, OracleType } from "@shared/types";
import { filter, find } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo } from "react";

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

export type UrlBarContextState = {
  addSearchParam: (name: string, value: string) => void;
  addSearchParams: (params: Record<string, string>) => void;
  removeSearchParam: (name: string) => void;
  removeSearchParams: (...params: string[]) => void;
};

export const defaultUrlBarContextState: UrlBarContextState = {
  addSearchParam: () => undefined,
  addSearchParams: () => undefined,
  removeSearchParam: () => undefined,
  removeSearchParams: () => undefined,
};

export const UrlBarContext = createContext(defaultUrlBarContextState);

export function UrlBarProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { all: queries } = useQueries();
  const { page } = usePageContext();
  const { panelOpen, openPanel, setQueryId } = usePanelContext();

  const addSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const addSearchParams = useCallback(
    (params: Record<string, string>) => {
      const urlSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        urlSearchParams.set(key, value);
      }

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const removeSearchParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete(name);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const removeSearchParams = useCallback(
    (...params: string[]) => {
      const urlSearchParams = new URLSearchParams(searchParams?.toString());

      for (const param of params) {
        urlSearchParams.delete(param);
      }

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // handle the current preferred way of linking to a query
  // uses transaction hash and event index

  useEffect(() => {
    if (!searchParams) return;

    const hasHash = searchParams?.has("transactionHash");
    const hasEventIndex = searchParams?.has("eventIndex");

    if (!hasHash && !hasEventIndex) return;

    openPanel();

    const transactionHash = searchParams.get("transactionHash")!;
    const eventIndex = searchParams.get("eventIndex")!;

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
            },
          )
        : forTx[0];
    setQueryId(query?.id);
  }, [queries]);

  // useEffect(() => {
  //   const hasHash = searchParams?.has("transactionHash");
  //   const isRequestDetails =
  //     searchParams?.has("chainId") &&
  //     searchParams?.has("oracleType") &&
  //     searchParams?.has("requester") &&
  //     searchParams?.has("timestamp") &&
  //     searchParams?.has("identifier") &&
  //     searchParams?.has("ancillaryData");

  //   if (!hasHash && !isRequestDetails) return;

  //   const {
  //     transactionHash,
  //     eventIndex,
  //     chainId,
  //     oracleType,
  //     requester,
  //     timestamp,
  //     identifier,
  //     ancillaryData,
  //   } = Object.fromEntries(searchParams?.entries() ?? []) as SearchParams;

  //   let query: OracleQueryUI | undefined;

  //   if (hasHash) {
  //     const forTx = filter<OracleQueryUI>(
  //       queries,
  //       ({
  //         requestHash,
  //         proposalHash,
  //         disputeHash,
  //         settlementHash,
  //         assertionHash,
  //       }) => {
  //         return (
  //           requestHash === transactionHash ||
  //           proposalHash === transactionHash ||
  //           disputeHash === transactionHash ||
  //           settlementHash === transactionHash ||
  //           assertionHash === transactionHash
  //         );
  //       },
  //     );

  //     const hasMultipleForTx = forTx.length > 1;

  //     query =
  //       hasMultipleForTx && exists(eventIndex)
  //         ? find<OracleQueryUI>(
  //             forTx,
  //             ({
  //               requestLogIndex,
  //               proposalLogIndex,
  //               disputeLogIndex,
  //               settlementLogIndex,
  //               assertionLogIndex,
  //             }) => {
  //               return (
  //                 requestLogIndex === eventIndex ||
  //                 proposalLogIndex === eventIndex ||
  //                 disputeLogIndex === eventIndex ||
  //                 settlementLogIndex === eventIndex ||
  //                 assertionLogIndex === eventIndex
  //               );
  //             },
  //           )
  //         : forTx[0];
  //   }

  //   if (isRequestDetails) {
  //     query = find<OracleQueryUI>(queries, {
  //       chainId,
  //       identifier,
  //       requester: lowerCase(requester),
  //       oracleType: getOracleTypeFromOldOracleName(oracleType!),
  //       timeUNIX: Number(timestamp),
  //       queryTextHex: ancillaryData,
  //     });
  //   }

  //   if (query && !panelOpen) {
  //     const pageForQuery = getPageForQuery(query);

  //     if (pageForQuery !== page) {
  //       void redirectToCorrectPage();
  //     }

  //     openPanel(query.id);

  //     function redirectToCorrectPage() {
  //       const pathname = `/${pageForQuery === "verify" ? "" : pageForQuery}`;
  //       router.push(pathname);
  //     }
  //   }
  // }, [queries]);

  const value = useMemo(
    () => ({
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
    }),
    [addSearchParam, addSearchParams, removeSearchParam, removeSearchParams],
  );

  return (
    <UrlBarContext.Provider value={value}>{children}</UrlBarContext.Provider>
  );
}
