import { redis } from "./_utils";
import { fetchOracleQueries } from "./_fetch";
import { processQueries } from "./_process";
import type { OracleQueryUI } from "@/types";

interface BatchProcessingOptions {
  page: string;
  chainId?: number;
  limit: number;
  offset: number;
  batchSize?: number;
  maxBatches?: number;
}

interface BatchProcessingResult {
  queries: OracleQueryUI[];
  lastProcessedTimestamp: string;
  totalProcessed: number;
  hasMore: boolean;
}

// Helper function to get the latest processed timestamp for a page/chain combination
export async function getLatestProcessedTimestamp(
  page: string,
  chainId?: number,
): Promise<string> {
  const key = `oracle-queries:last-processed:${page}:${chainId || "all"}`;
  const timestamp = await redis.get(key);
  return (timestamp as string) || "0"; // Default to epoch if no timestamp found
}

// Helper function to set the latest processed timestamp
export async function setLatestProcessedTimestamp(
  page: string,
  chainId: number | undefined,
  timestamp: string,
): Promise<void> {
  const key = `oracle-queries:last-processed:${page}:${chainId || "all"}`;
  await redis.set(key, timestamp);
}

// Helper function to reset the latest processed timestamp (for testing)
export async function resetLatestProcessedTimestamp(
  page: string,
  chainId?: number,
): Promise<void> {
  const key = `oracle-queries:last-processed:${page}:${chainId || "all"}`;
  await redis.del(key);
}

// Helper function to get batch processing status
export async function getBatchProcessingStatus(
  page: string,
  chainId?: number,
): Promise<{
  lastProcessedTimestamp: string;
  currentTimestamp: string;
  timeSinceLastProcess: number;
}> {
  const lastProcessed = await getLatestProcessedTimestamp(page, chainId);
  const current = Date.now().toString();
  const timeSinceLastProcess = Date.now() - parseInt(lastProcessed);

  return {
    lastProcessedTimestamp: lastProcessed,
    currentTimestamp: current,
    timeSinceLastProcess,
  };
}

// Helper function to process data in batches
export async function processBatch(
  fromTimestamp: string,
  toTimestamp: string,
  options: BatchProcessingOptions,
): Promise<OracleQueryUI[]> {
  const { page, chainId } = options;

  // Fetch data for the time range with timestamp filtering
  const fetchResult = await fetchOracleQueries({
    page,
    chainId,
    limit: 1000, // Fetch more data than needed to ensure we have enough after filtering
    offset: 0,
    fromTimestamp,
    toTimestamp,
  });

  // Process the fetched data
  const processedQueries = processQueries(fetchResult, {
    page,
    limit: 1000,
    offset: 0,
  });

  return processedQueries;
}

// Main batch processing function
export async function processBatches(
  options: BatchProcessingOptions,
): Promise<BatchProcessingResult> {
  const {
    page,
    chainId,
    limit,
    offset,
    batchSize = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxBatches = 10, // Maximum number of batches to process in one request
  } = options;

  const lastProcessedTimestamp = await getLatestProcessedTimestamp(
    page,
    chainId,
  );

  const allQueries: OracleQueryUI[] = [];
  let processedBatches = 0;
  let lastProcessed = lastProcessedTimestamp;

  // Process batches from last processed timestamp to current time
  let fromTimestamp = parseInt(lastProcessedTimestamp);
  const toTimestamp = Date.now();

  while (fromTimestamp < toTimestamp && processedBatches < maxBatches) {
    const batchToTimestamp = Math.min(fromTimestamp + batchSize, toTimestamp);

    console.log(
      `Processing batch ${processedBatches + 1}: ${new Date(
        fromTimestamp,
      ).toISOString()} to ${new Date(batchToTimestamp).toISOString()}`,
    );

    try {
      const batchQueries = await processBatch(
        fromTimestamp.toString(),
        batchToTimestamp.toString(),
        { ...options, limit: 1000, offset: 0 },
      );

      allQueries.push(...batchQueries);
      lastProcessed = batchToTimestamp.toString();
      processedBatches++;

      // Update the last processed timestamp after each successful batch
      await setLatestProcessedTimestamp(page, chainId, lastProcessed);

      console.log(
        `Batch ${processedBatches} processed: ${batchQueries.length} queries`,
      );
    } catch (error) {
      console.error(`Error processing batch ${processedBatches + 1}:`, error);
      // Continue with next batch
    }

    fromTimestamp = batchToTimestamp;
  }

  // Sort all queries by time (newest first)
  allQueries.sort((a, b) => {
    const timeA = a.timeMilliseconds || 0;
    const timeB = b.timeMilliseconds || 0;
    return timeB - timeA;
  });

  // Apply pagination
  const paginatedQueries = allQueries.slice(offset, offset + limit);

  return {
    queries: paginatedQueries,
    lastProcessedTimestamp: lastProcessed,
    totalProcessed: allQueries.length,
    hasMore: fromTimestamp < toTimestamp || allQueries.length > offset + limit,
  };
}

// Helper function to get cached queries for a specific page/chain combination
export async function getCachedQueriesForPage(
  page: string,
  chainId?: number,
  limit: number = 50,
  offset: number = 0,
): Promise<OracleQueryUI[]> {
  // For now, we'll always process batches since we're not caching the full data
  // In the future, we could implement a more sophisticated caching strategy
  const result = await processBatches({
    page,
    chainId,
    limit,
    offset,
  });

  return result.queries;
}
