import type { NextApiRequest, NextApiResponse } from "next";
import type { SubgraphConfig } from "@/constants";
import { config } from "@/constants";
import type {
  OOV1GraphEntity,
  OOV2GraphEntity,
  OOV3GraphEntity,
  OracleType,
} from "@shared/types";
import { searchByHash, searchByDetails } from "./_gql";
import { searchByHashViaRpc } from "./_rpc";

type Page = "verify" | "propose" | "settled";

type DeeplinkResult = {
  type: "request" | "assertion";
  entity: OOV1GraphEntity | OOV2GraphEntity | OOV3GraphEntity;
  chainId: number;
  oracleType: string;
  oracleAddress: string;
  page: Page;
};

export type ScoredResult = {
  type: "request" | "assertion";
  entity: OOV1GraphEntity | OOV2GraphEntity | OOV3GraphEntity;
  config: SubgraphConfig;
  score: number;
};

// Legacy short-form oracle type mapping (used by old deeplink URLs)
const LEGACY_ORACLE_TYPE_MAP: Record<string, OracleType> = {
  Optimistic: "Optimistic Oracle V1",
  OptimisticV2: "Optimistic Oracle V2",
  OptimisticV3: "Optimistic Oracle V3",
  Skinny: "Skinny Optimistic Oracle",
  ManagedV2: "Managed Optimistic Oracle V2",
};

const VALID_ORACLE_TYPES: OracleType[] = [
  "Optimistic Oracle V1",
  "Optimistic Oracle V2",
  "Optimistic Oracle V3",
  "Skinny Optimistic Oracle",
  "Managed Optimistic Oracle V2",
];

function isTransactionHash(hash: string | undefined): hash is string {
  return !!hash && hash.startsWith("0x") && hash.length === 66;
}

function normalizeOracleType(t: string | undefined): OracleType | undefined {
  if (!t) return undefined;
  if (VALID_ORACLE_TYPES.includes(t as OracleType)) return t as OracleType;
  return LEGACY_ORACLE_TYPE_MAP[t];
}

export function isV3(type: OracleType) {
  return type === "Optimistic Oracle V3";
}

export function isManaged(type: OracleType) {
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

function eventDistanceScore(value: number, target: number) {
  const distance = Math.abs(value - target);
  if (distance === 0) return 4;
  const maxDistance = Math.max(distance, 10);
  return -(maxDistance / 10);
}

export function scoreRequestEntity(
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

export function scoreAssertionEntity(
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
  const normalizedOracleType = normalizeOracleType(oracleType);
  let configs = config.subgraphs;
  if (chainId) {
    configs = configs.filter((c) => c.chainId === chainId);
  }
  if (normalizedOracleType) {
    configs = configs.filter((c) => c.type === normalizedOracleType);
  }

  if (configs.length === 0) {
    return res.status(404).json({ error: "not_found" });
  }

  let scoredResults: ScoredResult[] = [];

  // Hash-based lookup
  if (isTransactionHash(transactionHash)) {
    scoredResults = await searchByHash(configs, transactionHash, eventIndex);

    // RPC fallback: if subgraph search found nothing, try fetching the tx
    // receipt directly from an RPC provider and parsing the logs.
    if (scoredResults.length === 0) {
      let providerConfigs = config.providers;
      if (chainId) {
        providerConfigs = providerConfigs.filter((p) => p.chainId === chainId);
      }
      if (normalizedOracleType) {
        providerConfigs = providerConfigs.filter(
          (p) => p.type === normalizedOracleType,
        );
      }
      scoredResults = await searchByHashViaRpc(
        providerConfigs,
        transactionHash,
        eventIndex,
      );
    }
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
