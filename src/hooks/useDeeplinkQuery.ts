"use client";

import { isTransactionHash } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePanelContext, usePageContext } from "./contexts";
import {
  parseDeeplinkParams,
  parseLegacyDeeplinkParams,
  hasLegacyDeeplinkParams,
} from "@/helpers/deeplink";
import { buildSearchParams } from "@shared/utils/http";
import type { OracleQueryUI } from "@/types";
import type {
  ChainId,
  OOV1GraphEntity,
  OOV2GraphEntity,
  OOV3GraphEntity,
  OracleType,
} from "@shared/types";
import {
  parseAssertionGraphEntity,
  parsePriceRequestGraphEntity,
} from "@shared/utils";
import {
  assertionToOracleQuery,
  requestToOracleQuery,
} from "@/helpers/converters";
import type { Address } from "wagmi";

type DeeplinkResponse = {
  type: "request" | "assertion";
  entity: OOV1GraphEntity | OOV2GraphEntity | OOV3GraphEntity;
  chainId: number;
  oracleType: string;
  oracleAddress: string;
  page: "verify" | "propose" | "settled";
  error?: string;
};

async function resolveDeeplink(
  params: Record<string, string | number | null | undefined>,
): Promise<DeeplinkResponse> {
  const qs = buildSearchParams(params);
  const res = await fetch(`/api/resolve-deeplink?${qs}`);
  if (!res.ok) throw new Error("Deeplink resolution failed");
  return res.json() as Promise<DeeplinkResponse>;
}

function toOracleQuery(data: DeeplinkResponse): OracleQueryUI {
  if (data.type === "assertion") {
    const parsed = parseAssertionGraphEntity(
      data.entity as OOV3GraphEntity,
      data.chainId as ChainId,
      data.oracleAddress as Address,
    );
    return assertionToOracleQuery(parsed);
  }
  const parsed = parsePriceRequestGraphEntity(
    data.entity as OOV1GraphEntity | OOV2GraphEntity,
    data.chainId as ChainId,
    data.oracleAddress as Address,
    data.oracleType as OracleType,
  );
  return requestToOracleQuery(parsed);
}

export function useDeeplinkQuery() {
  const searchParams = useSearchParams();
  const { transactionHash, eventIndex, chainId, oracleType } =
    parseDeeplinkParams(searchParams);
  const legacyParams = parseLegacyDeeplinkParams(searchParams);
  const { page } = usePageContext();
  const router = useRouter();
  const { openPanelWithQuery, openedFromTable } = usePanelContext();

  const hasHashDeeplink = isTransactionHash(transactionHash ?? undefined);
  const hasLegacyDeeplink =
    !hasHashDeeplink && hasLegacyDeeplinkParams(legacyParams);
  const hasDeeplink = hasHashDeeplink || hasLegacyDeeplink;

  const { data, isLoading, error } = useQuery({
    queryKey: hasHashDeeplink
      ? ["deeplink", "hash", transactionHash, eventIndex, chainId, oracleType]
      : [
          "deeplink",
          "legacy",
          legacyParams.chainId,
          legacyParams.oracleType,
          legacyParams.requester,
          legacyParams.timestamp,
          legacyParams.identifier,
          legacyParams.ancillaryData,
        ],
    queryFn: () =>
      hasHashDeeplink
        ? resolveDeeplink({ transactionHash, eventIndex, chainId, oracleType })
        : resolveDeeplink(legacyParams),
    // Skip when the panel was opened from a table row click — URL params were
    // written by PanelContext, not by an inbound deeplink.
    enabled: hasDeeplink && !openedFromTable,
    staleTime: Infinity,
    // Retry a few times to allow subgraph indexing to catch up for fresh transactions.
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt * 3000, 10000),
  });

  useEffect(() => {
    if (!data || data.error) return;

    const targetPage = data.page;
    const targetPath = targetPage === "verify" ? "/" : `/${targetPage}`;
    const currentPath = page === "verify" ? "/" : `/${page}`;

    if (currentPath !== targetPath) {
      // Preserve whichever params brought us here
      const qs = hasHashDeeplink
        ? buildSearchParams({
            transactionHash,
            eventIndex,
            chainId,
            oracleType,
          })
        : buildSearchParams(legacyParams);
      router.replace(`${targetPath}?${qs}`, { scroll: false });
      return;
    }

    // On the correct page — open panel with resolved entity
    const query = toOracleQuery(data);
    openPanelWithQuery(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);

  return { isLoading: hasDeeplink && isLoading, error };
}
