import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { usePageContext, usePanelContext } from "./contexts";
import { useQueries } from "./queries";

export function useUrlBar() {
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

  return useMemo(
    () => ({
      searchParams,
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
    }),
    [
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
      searchParams,
    ],
  );
}
