"use client";

import { isTransactionHash } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePanelContext, usePageContext } from "./contexts";
import { parseDeeplinkParams } from "./useDeeplinkParams";
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

type FetchParams = {
  transactionHash: string;
  eventIndex?: string | null;
  chainId?: number | null;
  oracleType?: string | null;
};

async function resolveDeeplink(params: FetchParams): Promise<DeeplinkResponse> {
  const qs = buildSearchParams({
    transactionHash: params.transactionHash,
    ...(params.eventIndex ? { eventIndex: params.eventIndex } : {}),
    ...(params.chainId ? { chainId: params.chainId } : {}),
    ...(params.oracleType ? { oracleType: params.oracleType } : {}),
  });

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
  const { page } = usePageContext();
  const router = useRouter();
  const { openPanelWithQuery, openedFromTable } = usePanelContext();

  const hasDeeplink = isTransactionHash(transactionHash ?? undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["deeplink", transactionHash, eventIndex, chainId, oracleType],
    queryFn: () =>
      resolveDeeplink({
        transactionHash: transactionHash!,
        eventIndex,
        chainId,
        oracleType,
      }),
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
      const qs = buildSearchParams({
        transactionHash: transactionHash!,
        ...(eventIndex ? { eventIndex } : {}),
        ...(chainId ? { chainId } : {}),
        ...(oracleType ? { oracleType } : {}),
      });
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
