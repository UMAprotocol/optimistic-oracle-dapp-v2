import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryParam, safeParseInt } from "./_utils";
import {
  getBatchProcessingStatus,
  resetLatestProcessedTimestamp,
  processBatches,
} from "./_batch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const action = getQueryParam(req.query.action);
    const page = getQueryParam(req.query.page) || "verify";
    const chainId = getQueryParam(req.query.chainId);
    const limit = safeParseInt(req.query.limit, 10);
    const offset = safeParseInt(req.query.offset, 0);

    // Parse chainId if provided
    const parsedChainId = chainId ? parseInt(chainId, 10) : undefined;
    if (chainId && isNaN(parsedChainId!)) {
      return res.status(400).json({
        error: "Invalid chainId",
      });
    }

    switch (action) {
      case "status": {
        // Get batch processing status
        const status = await getBatchProcessingStatus(page, parsedChainId);
        return res.status(200).json({
          action: "status",
          page,
          chainId: parsedChainId,
          ...status,
        });
      }
      case "reset": {
        // Reset the latest processed timestamp
        await resetLatestProcessedTimestamp(page, parsedChainId);
        return res.status(200).json({
          action: "reset",
          page,
          chainId: parsedChainId,
          message: "Latest processed timestamp reset",
        });
      }
      case "process": {
        // Process a small batch for testing
        const result = await processBatches({
          page,
          chainId: parsedChainId,
          limit,
          offset,
          batchSize: 60 * 60 * 1000, // 1 hour for testing
          maxBatches: 2, // Only process 2 batches for testing
        });

        return res.status(200).json({
          action: "process",
          page,
          chainId: parsedChainId,
          queries: result.queries,
          totalProcessed: result.totalProcessed,
          lastProcessedTimestamp: result.lastProcessedTimestamp,
          hasMore: result.hasMore,
        });
      }

      default:
        return res.status(400).json({
          error: "Invalid action. Must be one of: status, reset, process",
        });
    }
  } catch (error) {
    console.error("Test batch API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
