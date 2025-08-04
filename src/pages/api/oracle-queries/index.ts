import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryParam, safeParseInt } from "./_utils";
import { processBatches } from "./_batch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = getQueryParam(req.query.page) || "verify";
    const chainId = getQueryParam(req.query.chainId);
    const limit = safeParseInt(req.query.limit, 50);
    const offset = safeParseInt(req.query.offset, 0);
    const forceRefresh = getQueryParam(req.query.forceRefresh) === "true";

    // Validate parameters
    const validPages = ["verify", "propose", "settled"];
    if (!validPages.includes(page)) {
      return res.status(400).json({
        error: `Invalid page. Must be one of: ${validPages.join(", ")}`,
      });
    }

    if (limit <= 0 || limit > 100) {
      return res.status(400).json({
        error: "Limit must be between 1 and 100",
      });
    }

    if (offset < 0) {
      return res.status(400).json({
        error: "Offset must be non-negative",
      });
    }

    // Parse chainId if provided
    const parsedChainId = chainId ? parseInt(chainId, 10) : undefined;
    if (chainId && isNaN(parsedChainId!)) {
      return res.status(400).json({
        error: "Invalid chainId",
      });
    }

    // Process batches to get the latest data
    const batchResult = await processBatches({
      page,
      chainId: parsedChainId,
      limit,
      offset,
      batchSize: 24 * 60 * 60 * 1000, // 24 hours
      maxBatches: forceRefresh ? 20 : 5, // Process more batches on force refresh
    });

    return res.status(200).json({
      queries: batchResult.queries,
      pagination: {
        total: batchResult.totalProcessed,
        hasMore: batchResult.hasMore,
        offset,
        limit,
      },
      lastUpdated: new Date().toISOString(),
      lastProcessedTimestamp: batchResult.lastProcessedTimestamp,
      cached: false, // We're not caching the full data anymore
    });
  } catch (error) {
    console.error("Oracle queries API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
