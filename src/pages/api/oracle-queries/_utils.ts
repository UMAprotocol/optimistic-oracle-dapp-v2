import { Redis } from "@upstash/redis";
import type { OracleQueryUI } from "@/types";

// Initialize Redis
export const redis = Redis.fromEnv();

// Helper function to safely get query parameters
export function getQueryParam(
  param: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
}

// Helper function to safely parse integers
export function safeParseInt(
  value: string | string[] | undefined,
  defaultValue: number,
): number {
  const strValue = getQueryParam(value);
  if (!strValue) return defaultValue;

  const parsed = parseInt(strValue, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Helper function to generate cache keys
export function generateCacheKey(
  page: string,
  chainId?: string,
  limit?: number,
  offset?: number,
): string {
  const chain = chainId || "all";
  const limitStr = limit?.toString() || "50";
  const offsetStr = offset?.toString() || "0";
  return `oracle-queries:${page}:${chain}:${limitStr}:${offsetStr}`;
}

// Helper function to safely get cached data
export async function getCachedQueries(
  key: string,
): Promise<OracleQueryUI[] | null> {
  try {
    const cached = await redis.get(key);
    return cached as OracleQueryUI[] | null;
  } catch (error) {
    console.error("Error getting cached data:", error);
    return null;
  }
}

// Helper function to safely get cached timestamp
export async function getCachedTimestamp(key: string): Promise<string | null> {
  try {
    const cached = await redis.get(key);
    return cached as string | null;
  } catch (error) {
    console.error("Error getting cached timestamp:", error);
    return null;
  }
}
