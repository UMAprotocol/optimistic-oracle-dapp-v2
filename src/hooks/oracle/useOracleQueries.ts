import { config } from "@/constants";
import type { Assertion, Request } from "@shared/types";
import { useQueries as useTanstackQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchVerifyRequests,
  fetchVerifyAssertions,
  fetchProposeRequests,
  fetchSettledRequests,
  fetchSettledAssertions,
  splitConfigsByType,
} from "./fetchers";

const maxSettledPerSubgraph = Number(config.maxSettledRequests);

const { requestConfigs, assertionConfigs } = splitConfigsByType(
  config.subgraphs,
);

export type OracleQueryResult = {
  requests: Request[];
  assertions: Assertion[];
  isLoading: boolean;
  errors: Error[];
};

/**
 * Aggregate parallel query results into a single stable object.
 * Individual .data refs from Tanstack Query are stable between renders,
 * so we memoize based on them to avoid creating new arrays every render.
 */
function useAggregateResults(
  requestResults: { data?: Request[]; isLoading: boolean; error: unknown }[],
  assertionResults: {
    data?: Assertion[];
    isLoading: boolean;
    error: unknown;
  }[],
): OracleQueryResult {
  const requestDataRefs = requestResults.map((r) => r.data);
  const assertionDataRefs = assertionResults.map((r) => r.data);
  const requestErrorRefs = requestResults.map((r) => r.error);
  const assertionErrorRefs = assertionResults.map((r) => r.error);

  const requests = useMemo(
    () => requestDataRefs.flatMap((d) => d ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    requestDataRefs,
  );

  const assertions = useMemo(
    () => assertionDataRefs.flatMap((d) => d ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    assertionDataRefs,
  );

  const isLoading =
    requestResults.some((r) => r.isLoading) ||
    assertionResults.some((r) => r.isLoading);

  const errors = useMemo(
    () =>
      [...requestErrorRefs, ...assertionErrorRefs]
        .filter(Boolean)
        .map((e) => (e instanceof Error ? e : new Error(String(e)))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...requestErrorRefs, ...assertionErrorRefs],
  );

  return { requests, assertions, isLoading, errors };
}

// --- Per-page hooks ---

export function useVerifyData(): OracleQueryResult {
  const requestResults = useTanstackQueries({
    queries: requestConfigs.map((subgraphConfig) => ({
      queryKey: [
        "oracle",
        "verify",
        "requests",
        subgraphConfig.chainId,
        subgraphConfig.type,
      ],
      queryFn: () => fetchVerifyRequests(subgraphConfig),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    })),
  });

  const assertionResults = useTanstackQueries({
    queries: assertionConfigs.map((subgraphConfig) => ({
      queryKey: [
        "oracle",
        "verify",
        "assertions",
        subgraphConfig.chainId,
        subgraphConfig.type,
      ],
      queryFn: () => fetchVerifyAssertions(subgraphConfig),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    })),
  });

  return useAggregateResults(requestResults, assertionResults);
}

export function useProposeData(enabled: boolean): OracleQueryResult {
  // Only request configs — V3 has no propose state
  const requestResults = useTanstackQueries({
    queries: requestConfigs.map((subgraphConfig) => ({
      queryKey: [
        "oracle",
        "propose",
        "requests",
        subgraphConfig.chainId,
        subgraphConfig.type,
      ],
      queryFn: () => fetchProposeRequests(subgraphConfig),
      staleTime: 60_000,
      enabled,
      refetchOnWindowFocus: false,
    })),
  });

  return useAggregateResults(requestResults, []);
}

export function useSettledData(enabled: boolean): OracleQueryResult {
  const requestResults = useTanstackQueries({
    queries: requestConfigs.map((subgraphConfig) => ({
      queryKey: [
        "oracle",
        "settled",
        "requests",
        subgraphConfig.chainId,
        subgraphConfig.type,
      ],
      queryFn: () =>
        fetchSettledRequests(subgraphConfig, maxSettledPerSubgraph),
      staleTime: 5 * 60_000, // 5 min stale
      enabled,
      refetchOnWindowFocus: false,
    })),
  });

  const assertionResults = useTanstackQueries({
    queries: assertionConfigs.map((subgraphConfig) => ({
      queryKey: [
        "oracle",
        "settled",
        "assertions",
        subgraphConfig.chainId,
        subgraphConfig.type,
      ],
      queryFn: () =>
        fetchSettledAssertions(subgraphConfig, maxSettledPerSubgraph),
      staleTime: 5 * 60_000,
      enabled,
      refetchOnWindowFocus: false,
    })),
  });

  return useAggregateResults(requestResults, assertionResults);
}
