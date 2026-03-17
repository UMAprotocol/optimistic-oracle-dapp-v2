import type { NextApiRequest, NextApiResponse } from "next";
import type { SubgraphConfig } from "@/constants";
import { config } from "@/constants";
import type {
  OOV1GraphEntity,
  OOV2GraphEntity,
  OOV3GraphEntity,
  OracleType,
} from "@shared/types";
import {
  getRequestByHash as getOOV1RequestByHash,
  getRequestByDetails as getOOV1RequestByDetails,
} from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import { getRequestByHash as getManagedRequestByHash } from "@libs/oracle-sdk-v2/services/managedv2/gql/queries";
import { getAssertionByHash } from "@libs/oracle-sdk-v2/services/oraclev3/gql/queries";

type Page = "verify" | "propose" | "settled";

type DeeplinkResult = {
  type: "request" | "assertion";
  entity: OOV1GraphEntity | OOV2GraphEntity | OOV3GraphEntity;
  chainId: number;
  oracleType: string;
  oracleAddress: string;
  page: Page;
};

function isTransactionHash(hash: string | undefined): hash is string {
  return !!hash && hash.startsWith("0x") && hash.length === 66;
}

const VALID_ORACLE_TYPES: OracleType[] = [
  "Optimistic Oracle V1",
  "Optimistic Oracle V2",
  "Optimistic Oracle V3",
  "Skinny Optimistic Oracle",
  "Managed Optimistic Oracle V2",
];

function isValidOracleType(t: string | undefined): t is OracleType {
  return !!t && VALID_ORACLE_TYPES.includes(t as OracleType);
}

function isV3(type: OracleType) {
  return type === "Optimistic Oracle V3";
}

function isManaged(type: OracleType) {
  return type === "Managed Optimistic Oracle V2";
}

function getPageForRequestState(state: string | null): Page {
  if (state === "Requested") return "propose";
  if (state === "Proposed" || state === "Disputed" || state === "Expired")
    return "verify";
  return "settled";
}

function getPageForAssertion(entity: OOV3GraphEntity): Page {
  return entity.settlementHash ? "settled" : "verify";
}

// Scoring logic ported from useQueryInSearchParams
function eventDistanceScore(value: number, target: number) {
  const distance = Math.abs(value - target);
  if (distance === 0) return 4;
  const maxDistance = Math.max(distance, 10);
  return -(maxDistance / 10);
}

type ScoredResult = {
  type: "request" | "assertion";
  entity: OOV1GraphEntity | OOV2GraphEntity | OOV3GraphEntity;
  config: SubgraphConfig;
  score: number;
};

function scoreRequestEntity(
  entity: OOV1GraphEntity | OOV2GraphEntity,
  txHash: string,
  eventIndex: number | undefined,
): number {
  let s = 0;
  if (entity.requestHash === txHash) {
    s += 4;
    if (eventIndex !== undefined && entity.requestLogIndex !== null) {
      s += eventDistanceScore(Number(entity.requestLogIndex), eventIndex);
    }
  }
  if (entity.proposalHash === txHash) {
    s += 3;
    if (eventIndex !== undefined && entity.proposalLogIndex !== null) {
      s += eventDistanceScore(Number(entity.proposalLogIndex), eventIndex);
    }
  }
  if (entity.disputeHash === txHash) {
    s += 2;
    if (eventIndex !== undefined && entity.disputeLogIndex !== null) {
      s += eventDistanceScore(Number(entity.disputeLogIndex), eventIndex);
    }
  }
  if (entity.settlementHash === txHash) {
    s += 1;
    if (eventIndex !== undefined && entity.settlementLogIndex !== null) {
      s += eventDistanceScore(Number(entity.settlementLogIndex), eventIndex);
    }
  }
  return s;
}

function scoreAssertionEntity(
  entity: OOV3GraphEntity,
  txHash: string,
  eventIndex: number | undefined,
): number {
  let s = 0;
  if (entity.assertionHash === txHash) {
    s += 4;
    if (eventIndex !== undefined && entity.assertionLogIndex !== null) {
      s += eventDistanceScore(Number(entity.assertionLogIndex), eventIndex);
    }
  }
  if (entity.disputeHash === txHash) {
    s += 2;
    if (eventIndex !== undefined && entity.disputeLogIndex !== null) {
      s += eventDistanceScore(Number(entity.disputeLogIndex), eventIndex);
    }
  }
  if (entity.settlementHash === txHash) {
    s += 1;
    if (eventIndex !== undefined && entity.settlementLogIndex !== null) {
      s += eventDistanceScore(Number(entity.settlementLogIndex), eventIndex);
    }
  }
  return s;
}

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

async function searchByHash(
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

async function searchByDetails(
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeeplinkResult | { error: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const {
    transactionHash,
    eventIndex: eventIndexStr,
    chainId: chainIdStr,
    oracleType,
    requester,
    timestamp,
    identifier,
    ancillaryData,
  } = req.query as Record<string, string | undefined>;

  const chainId = chainIdStr ? Number(chainIdStr) : undefined;
  const eventIndex =
    eventIndexStr && Number.isInteger(Number(eventIndexStr))
      ? Number(eventIndexStr)
      : undefined;

  // Filter configs based on provided chainId and oracleType
  let configs = config.subgraphs;
  if (chainId) {
    configs = configs.filter((c) => c.chainId === chainId);
  }
  if (isValidOracleType(oracleType)) {
    configs = configs.filter((c) => c.type === oracleType);
  }

  if (configs.length === 0) {
    return res.status(404).json({ error: "not_found" });
  }

  let scoredResults: ScoredResult[] = [];

  // Hash-based lookup
  if (isTransactionHash(transactionHash)) {
    scoredResults = await searchByHash(configs, transactionHash, eventIndex);
  }
  // Legacy detail-based lookup
  else if (requester && timestamp && identifier && ancillaryData) {
    scoredResults = await searchByDetails(configs, {
      requester,
      time: timestamp,
      identifier,
      ancillaryData,
    });
  } else {
    return res.status(400).json({ error: "missing_params" });
  }

  if (scoredResults.length === 0) {
    return res.status(404).json({ error: "not_found" });
  }

  // Sort by score descending
  scoredResults.sort((a, b) => b.score - a.score);

  const best = scoredResults[0];
  const second = scoredResults[1];

  // If there's a tie between first and second, we can't reliably pick one
  if (second && best.score === second.score && best.score < 10) {
    return res.status(404).json({ error: "not_found" });
  }

  // Determine target page
  let page: Page;
  if (best.type === "assertion") {
    page = getPageForAssertion(best.entity as OOV3GraphEntity);
  } else {
    const requestEntity = best.entity as OOV1GraphEntity | OOV2GraphEntity;
    page = getPageForRequestState(requestEntity.state);
  }

  // Settled requests won't change state — cache indefinitely.
  // Active requests may transition between states, so cap at 5 minutes.
  if (page === "settled") {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=31536000, stale-while-revalidate=31536000",
    );
  } else {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );
  }

  return res.status(200).json({
    type: best.type,
    entity: best.entity,
    chainId: best.config.chainId,
    oracleType: best.config.type,
    oracleAddress: best.config.address,
    page,
  });
}
