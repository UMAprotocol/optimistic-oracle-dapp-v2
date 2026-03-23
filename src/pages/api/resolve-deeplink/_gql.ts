import type { SubgraphConfig } from "@/constants";
import {
  getRequestByHash as getOOV1RequestByHash,
  getRequestByDetails as getOOV1RequestByDetails,
} from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import { getRequestByHash as getManagedRequestByHash } from "@libs/oracle-sdk-v2/services/managedv2/gql/queries";
import { getAssertionByHash } from "@libs/oracle-sdk-v2/services/oraclev3/gql/queries";
import type { ScoredResult } from "./index";
import {
  scoreRequestEntity,
  scoreAssertionEntity,
  isV3,
  isManaged,
} from "./index";

async function fetchWithUrlFallback<T>(
  urls: string[],
  fetcher: (url: string) => Promise<T>,
): Promise<T> {
  let lastError: Error | undefined;
  for (const url of urls) {
    try {
      return await fetcher(url);
    } catch (error) {
      lastError = error as Error;
    }
  }
  throw lastError ?? new Error("All URLs failed");
}

export async function searchByHash(
  configs: SubgraphConfig[],
  txHash: string,
  eventIndex: number | undefined,
): Promise<ScoredResult[]> {
  const results: ScoredResult[] = [];

  const promises = configs.map(async (cfg) => {
    try {
      if (isV3(cfg.type)) {
        const entities = await fetchWithUrlFallback(cfg.urls, (url) =>
          getAssertionByHash(url, txHash),
        );
        for (const entity of entities) {
          const score = scoreAssertionEntity(entity, txHash, eventIndex);
          if (score > 0) {
            results.push({ type: "assertion", entity, config: cfg, score });
          }
        }
      } else if (isManaged(cfg.type)) {
        const entities = await fetchWithUrlFallback(cfg.urls, (url) =>
          getManagedRequestByHash(url, txHash),
        );
        for (const entity of entities) {
          const score = scoreRequestEntity(entity, txHash, eventIndex);
          if (score > 0) {
            results.push({ type: "request", entity, config: cfg, score });
          }
        }
      } else {
        const entities = await fetchWithUrlFallback(cfg.urls, (url) =>
          getOOV1RequestByHash(url, txHash, cfg.type),
        );
        for (const entity of entities) {
          const score = scoreRequestEntity(entity, txHash, eventIndex);
          if (score > 0) {
            results.push({ type: "request", entity, config: cfg, score });
          }
        }
      }
    } catch {
      // Individual subgraph failures are non-fatal
    }
  });

  await Promise.allSettled(promises);
  return results;
}

export async function searchByDetails(
  configs: SubgraphConfig[],
  params: {
    requester: string;
    time: string;
    identifier: string;
    ancillaryData: string;
  },
): Promise<ScoredResult[]> {
  const results: ScoredResult[] = [];
  // Only search non-V3 configs (V3 doesn't have these fields)
  const requestConfigs = configs.filter((c) => !isV3(c.type));

  const promises = requestConfigs.map(async (cfg) => {
    try {
      const entities = await fetchWithUrlFallback(cfg.urls, (url) =>
        getOOV1RequestByDetails(url, params, cfg.type),
      );
      for (const entity of entities) {
        results.push({ type: "request", entity, config: cfg, score: 10 });
      }
    } catch {
      // Individual subgraph failures are non-fatal
    }
  });

  await Promise.allSettled(promises);
  return results;
}
