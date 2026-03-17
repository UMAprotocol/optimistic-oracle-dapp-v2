import type { SubgraphConfig } from "@/constants";
import type {
  Assertion,
  AssertionGraphEntity,
  OracleType,
  PriceRequestGraphEntity,
  Request,
} from "@shared/types";
import {
  parseAssertionGraphEntity,
  parsePriceRequestGraphEntity,
} from "@shared/utils";
import type { Address } from "wagmi";

// GQL query functions (kept in libs)
import {
  getVerifyRequests as getOOV1VerifyRequests,
  getProposeRequests as getOOV1ProposeRequests,
  getSettledRequests as getOOV1SettledRequests,
} from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import {
  getVerifyRequests as getManagedVerifyRequests,
  getProposeRequests as getManagedProposeRequests,
  getSettledRequests as getManagedSettledRequests,
} from "@libs/oracle-sdk-v2/services/managedv2/gql/queries";
import {
  getVerifyAssertions,
  getSettledAssertions,
} from "@libs/oracle-sdk-v2/services/oraclev3/gql/queries";

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
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }
  throw lastError ?? new Error("All URLs failed");
}

function isV3(type: OracleType) {
  return type === "Optimistic Oracle V3";
}

function isManaged(type: OracleType) {
  return type === "Managed Optimistic Oracle V2";
}

function parseRequests(
  raw: PriceRequestGraphEntity[],
  config: SubgraphConfig,
): Request[] {
  const { chainId, type, address } = config;
  return raw.map((r) =>
    parsePriceRequestGraphEntity(r, chainId, address as Address, type),
  );
}

function parseAssertions(
  raw: AssertionGraphEntity[],
  config: SubgraphConfig,
): Assertion[] {
  const { chainId, address } = config;
  return raw.map((a) =>
    parseAssertionGraphEntity(a, chainId, address as Address),
  );
}

// --- Verify page fetchers ---

export async function fetchVerifyRequests(
  config: SubgraphConfig,
): Promise<Request[]> {
  const { urls, chainId, type } = config;
  const getVerify = isManaged(type)
    ? getManagedVerifyRequests
    : getOOV1VerifyRequests;
  const raw = await fetchWithUrlFallback(urls, (url) =>
    getVerify(url, chainId, type),
  );
  return parseRequests(raw, config);
}

export async function fetchVerifyAssertions(
  config: SubgraphConfig,
): Promise<Assertion[]> {
  const { urls, chainId } = config;
  const raw = await fetchWithUrlFallback(urls, (url) =>
    getVerifyAssertions(url, chainId),
  );
  return parseAssertions(raw, config);
}

// --- Propose page fetchers ---

export async function fetchProposeRequests(
  config: SubgraphConfig,
): Promise<Request[]> {
  const { urls, chainId, type } = config;
  const getPropose = isManaged(type)
    ? getManagedProposeRequests
    : getOOV1ProposeRequests;
  const raw = await fetchWithUrlFallback(urls, (url) =>
    getPropose(url, chainId, type),
  );
  return parseRequests(raw, config);
}

// --- Settled page fetchers ---

export async function fetchSettledRequests(
  config: SubgraphConfig,
): Promise<Request[]> {
  const { urls, chainId, type } = config;
  const getSettled = isManaged(type)
    ? getManagedSettledRequests
    : getOOV1SettledRequests;
  const raw = await fetchWithUrlFallback(urls, (url) =>
    getSettled(url, chainId, type),
  );
  return parseRequests(raw, config);
}

export async function fetchSettledAssertions(
  config: SubgraphConfig,
): Promise<Assertion[]> {
  const { urls, chainId } = config;
  const raw = await fetchWithUrlFallback(urls, (url) =>
    getSettledAssertions(url, chainId),
  );
  return parseAssertions(raw, config);
}

// --- Helpers ---

export function splitConfigsByType(configs: SubgraphConfig[]) {
  const requestConfigs = configs.filter((c) => !isV3(c.type));
  const assertionConfigs = configs.filter((c) => isV3(c.type));
  return { requestConfigs, assertionConfigs };
}
