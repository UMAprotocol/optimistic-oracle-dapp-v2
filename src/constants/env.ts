import { ContractInfoList, getContractAddress } from "@libs/constants";
import * as ss from "superstruct";

const Env = ss.object({
  NEXT_PUBLIC_DEFAULT_APY: ss.optional(ss.string()),
  NEXT_PUBLIC_INFURA_ID: ss.string(),
  NEXT_PUBLIC_DEFAULT_LIVENESS: ss.string(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ss.string(),
  NEXT_PUBLIC_SIMULATION_ENDPOINT: ss.string(),

  // Subgraph URLs are kept per oracle-version because each version has its own
  // schema. Format: NEXT_PUBLIC_SUBGRAPH_(VERSION | "SKINNY" | "MANAGED")_(CHAIN_ID)
  NEXT_PUBLIC_SUBGRAPH_V1_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_1514: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_11155111: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V2_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_1514: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_168587773: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V3_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_1514: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_168587773: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_SKINNY_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_1514: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_MANAGED_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_MANAGED_80002: ss.optional(ss.string()),

  // RPC providers: one URL per chain, shared across all oracle versions.
  // Format: NEXT_PUBLIC_PROVIDER_(CHAIN_ID). A chain-specific value here
  // overrides any universal-key fallback (see NEXT_PUBLIC_ALCHEMY_KEY /
  // NEXT_PUBLIC_QUICKNODE_KEY below).
  NEXT_PUBLIC_PROVIDER_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_1514: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_1516: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_168587773: ss.optional(ss.string()),

  // Universal RPC keys. When a chain has no NEXT_PUBLIC_PROVIDER_<id>
  // override, the dapp builds the URL from one of these. Alchemy is preferred
  // over QuickNode when both are set.
  // - NEXT_PUBLIC_ALCHEMY_KEY: an Alchemy app key; URL is built as
  //   https://<alchemy-slug>.g.alchemy.com/v2/<key>.
  // - NEXT_PUBLIC_QUICKNODE_KEY: a QuickNode URL template that contains the
  //   literal placeholder "{chain}" for the per-chain subdomain segment, e.g.
  //   https://your-endpoint{chain}.quiknode.pro/your-token/
  //   The placeholder expands to "" on Ethereum mainnet, ".matic" on Polygon,
  //   ".arbitrum-mainnet" on Arbitrum, etc. (see quicknodeSlugByChainId below).
  NEXT_PUBLIC_ALCHEMY_KEY: ss.optional(ss.string()),
  NEXT_PUBLIC_QUICKNODE_KEY: ss.optional(ss.string()),

  NEXT_PUBLIC_MAX_SETTLED_REQUESTS: ss.optional(ss.string()),
  NEXT_PUBLIC_SHOW_MANAGED_ORACLE_BANNER: ss.optional(ss.string()),
  NEXT_PUBLIC_ENABLE_FAST_VERIFY: ss.optional(ss.string()),
  NEXT_PUBLIC_VERIFY_DAYS_BACK: ss.optional(ss.string()),
});
export type Env = ss.Infer<typeof Env>;

// Every NEXT_PUBLIC_* env must be statically referenced here for Next.js to
// inline it into the client bundle.
const env = ss.create(
  {
    NEXT_PUBLIC_DEFAULT_APY: process.env.NEXT_PUBLIC_DEFAULT_APY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_SIMULATION_ENDPOINT:
      process.env.NEXT_PUBLIC_SIMULATION_ENDPOINT,
    NEXT_PUBLIC_DEFAULT_LIVENESS: process.env.NEXT_PUBLIC_DEFAULT_LIVENESS,

    NEXT_PUBLIC_SUBGRAPH_V1_1: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1,
    NEXT_PUBLIC_SUBGRAPH_V1_10: process.env.NEXT_PUBLIC_SUBGRAPH_V1_10,
    NEXT_PUBLIC_SUBGRAPH_V1_137: process.env.NEXT_PUBLIC_SUBGRAPH_V1_137,
    NEXT_PUBLIC_SUBGRAPH_V1_288: process.env.NEXT_PUBLIC_SUBGRAPH_V1_288,
    NEXT_PUBLIC_SUBGRAPH_V1_1514: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1514,
    NEXT_PUBLIC_SUBGRAPH_V1_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
    NEXT_PUBLIC_SUBGRAPH_V1_5: process.env.NEXT_PUBLIC_SUBGRAPH_V1_5,
    NEXT_PUBLIC_SUBGRAPH_V1_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V1_80001,
    NEXT_PUBLIC_SUBGRAPH_V1_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V1_80002,
    NEXT_PUBLIC_SUBGRAPH_V1_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V1_81457,
    NEXT_PUBLIC_SUBGRAPH_V1_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V1_8453,
    NEXT_PUBLIC_SUBGRAPH_V1_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V1_11155111,

    NEXT_PUBLIC_SUBGRAPH_V2_1: process.env.NEXT_PUBLIC_SUBGRAPH_V2_1,
    NEXT_PUBLIC_SUBGRAPH_V2_10: process.env.NEXT_PUBLIC_SUBGRAPH_V2_10,
    NEXT_PUBLIC_SUBGRAPH_V2_137: process.env.NEXT_PUBLIC_SUBGRAPH_V2_137,
    NEXT_PUBLIC_SUBGRAPH_V2_288: process.env.NEXT_PUBLIC_SUBGRAPH_V2_288,
    NEXT_PUBLIC_SUBGRAPH_V2_1514: process.env.NEXT_PUBLIC_SUBGRAPH_V2_1514,
    NEXT_PUBLIC_SUBGRAPH_V2_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V2_42161,
    NEXT_PUBLIC_SUBGRAPH_V2_5: process.env.NEXT_PUBLIC_SUBGRAPH_V2_5,
    NEXT_PUBLIC_SUBGRAPH_V2_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V2_80001,
    NEXT_PUBLIC_SUBGRAPH_V2_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V2_80002,
    NEXT_PUBLIC_SUBGRAPH_V2_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V2_81457,
    NEXT_PUBLIC_SUBGRAPH_V2_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V2_8453,
    NEXT_PUBLIC_SUBGRAPH_V2_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V2_11155111,
    NEXT_PUBLIC_SUBGRAPH_V2_168587773:
      process.env.NEXT_PUBLIC_SUBGRAPH_V2_168587773,

    NEXT_PUBLIC_SUBGRAPH_V3_1: process.env.NEXT_PUBLIC_SUBGRAPH_V3_1,
    NEXT_PUBLIC_SUBGRAPH_V3_10: process.env.NEXT_PUBLIC_SUBGRAPH_V3_10,
    NEXT_PUBLIC_SUBGRAPH_V3_137: process.env.NEXT_PUBLIC_SUBGRAPH_V3_137,
    NEXT_PUBLIC_SUBGRAPH_V3_288: process.env.NEXT_PUBLIC_SUBGRAPH_V3_288,
    NEXT_PUBLIC_SUBGRAPH_V3_1514: process.env.NEXT_PUBLIC_SUBGRAPH_V3_1514,
    NEXT_PUBLIC_SUBGRAPH_V3_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V3_42161,
    NEXT_PUBLIC_SUBGRAPH_V3_5: process.env.NEXT_PUBLIC_SUBGRAPH_V3_5,
    NEXT_PUBLIC_SUBGRAPH_V3_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V3_80001,
    NEXT_PUBLIC_SUBGRAPH_V3_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V3_80002,
    NEXT_PUBLIC_SUBGRAPH_V3_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V3_81457,
    NEXT_PUBLIC_SUBGRAPH_V3_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V3_8453,
    NEXT_PUBLIC_SUBGRAPH_V3_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V3_11155111,
    NEXT_PUBLIC_SUBGRAPH_V3_168587773:
      process.env.NEXT_PUBLIC_SUBGRAPH_V3_168587773,

    NEXT_PUBLIC_SUBGRAPH_SKINNY_1: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_10: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_10,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_137:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_137,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_288:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_288,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_1514:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1514,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_42161:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_42161,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_5: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_5,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_80001:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_80001,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_80002:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_80002,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_81457:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_81457,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_8453:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_8453,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773,

    NEXT_PUBLIC_SUBGRAPH_MANAGED_137:
      process.env.NEXT_PUBLIC_SUBGRAPH_MANAGED_137,
    NEXT_PUBLIC_SUBGRAPH_MANAGED_80002:
      process.env.NEXT_PUBLIC_SUBGRAPH_MANAGED_80002,

    NEXT_PUBLIC_PROVIDER_1: process.env.NEXT_PUBLIC_PROVIDER_1,
    NEXT_PUBLIC_PROVIDER_5: process.env.NEXT_PUBLIC_PROVIDER_5,
    NEXT_PUBLIC_PROVIDER_10: process.env.NEXT_PUBLIC_PROVIDER_10,
    NEXT_PUBLIC_PROVIDER_137: process.env.NEXT_PUBLIC_PROVIDER_137,
    NEXT_PUBLIC_PROVIDER_288: process.env.NEXT_PUBLIC_PROVIDER_288,
    NEXT_PUBLIC_PROVIDER_1514: process.env.NEXT_PUBLIC_PROVIDER_1514,
    NEXT_PUBLIC_PROVIDER_1516: process.env.NEXT_PUBLIC_PROVIDER_1516,
    NEXT_PUBLIC_PROVIDER_8453: process.env.NEXT_PUBLIC_PROVIDER_8453,
    NEXT_PUBLIC_PROVIDER_42161: process.env.NEXT_PUBLIC_PROVIDER_42161,
    NEXT_PUBLIC_PROVIDER_80001: process.env.NEXT_PUBLIC_PROVIDER_80001,
    NEXT_PUBLIC_PROVIDER_80002: process.env.NEXT_PUBLIC_PROVIDER_80002,
    NEXT_PUBLIC_PROVIDER_81457: process.env.NEXT_PUBLIC_PROVIDER_81457,
    NEXT_PUBLIC_PROVIDER_11155111: process.env.NEXT_PUBLIC_PROVIDER_11155111,
    NEXT_PUBLIC_PROVIDER_168587773: process.env.NEXT_PUBLIC_PROVIDER_168587773,

    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    NEXT_PUBLIC_QUICKNODE_KEY: process.env.NEXT_PUBLIC_QUICKNODE_KEY,

    NEXT_PUBLIC_MAX_SETTLED_REQUESTS:
      process.env.NEXT_PUBLIC_MAX_SETTLED_REQUESTS,
    NEXT_PUBLIC_SHOW_MANAGED_ORACLE_BANNER:
      process.env.NEXT_PUBLIC_SHOW_MANAGED_ORACLE_BANNER,
    NEXT_PUBLIC_ENABLE_FAST_VERIFY: process.env.NEXT_PUBLIC_ENABLE_FAST_VERIFY,
    NEXT_PUBLIC_VERIFY_DAYS_BACK: process.env.NEXT_PUBLIC_VERIFY_DAYS_BACK,
  },
  Env,
);

export const ChainId = ss.enums([
  1, 5, 10, 137, 288, 416, 8453, 11155111, 42161, 80001, 80002, 81457,
  168587773, 1514, 1516,
]);

const SubgraphConfig = ss.object({
  source: ss.literal("gql"),
  urls: ss.array(ss.string()),
  type: ss.enums([
    "Optimistic Oracle V1",
    "Optimistic Oracle V2",
    "Optimistic Oracle V3",
    "Skinny Optimistic Oracle",
    "Managed Optimistic Oracle V2",
  ]),
  chainId: ChainId,
  address: ss.string(),
});
export type SubgraphConfig = ss.Infer<typeof SubgraphConfig>;
const SubgraphConfigs = ss.array(SubgraphConfig);
export type SubgraphConfigs = ss.Infer<typeof SubgraphConfigs>;

const ProviderConfig = ss.object({
  source: ss.literal("provider"),
  chainId: ChainId,
  type: ss.enums([
    "Optimistic Oracle V1",
    "Optimistic Oracle V2",
    "Optimistic Oracle V3",
    "Skinny Optimistic Oracle",
    "Managed Optimistic Oracle V2",
  ]),
  url: ss.string(),
  address: ss.string(),
  deployBlock: ss.optional(ss.number()),
  blockHistoryLimit: ss.number(),
});
export type ProviderConfig = ss.Infer<typeof ProviderConfig>;
const ProviderConfigs = ss.array(ProviderConfig);
export type ProviderConfigs = ss.Infer<typeof ProviderConfigs>;

const Config = ss.object({
  simulationEndpoint: ss.string(),
  defaultApy: ss.string(),
  infuraId: ss.string(),
  walletconnectProjectId: ss.string(),
  defaultLiveness: ss.string(),
  subgraphs: SubgraphConfigs,
  providers: ProviderConfigs,
  maxSettledRequests: ss.string(),
  showManagedOracleBanner: ss.boolean(),
});
export type Config = ss.Infer<typeof Config>;

// Chain subdomain used when composing an Alchemy URL from NEXT_PUBLIC_ALCHEMY_KEY.
// Chains absent here are not covered by Alchemy and require either a per-chain
// override (NEXT_PUBLIC_PROVIDER_<id>) or a QuickNode template.
// Goerli (5) and Polygon Mumbai (80001) are intentionally omitted: Alchemy
// shut both off in April 2024, so the universal key cannot serve them.
const alchemySlugByChainId: Record<number, string> = {
  1: "eth-mainnet",
  10: "opt-mainnet",
  137: "polygon-mainnet",
  8453: "base-mainnet",
  42161: "arb-mainnet",
  80002: "polygon-amoy",
  81457: "blast-mainnet",
  11155111: "eth-sepolia",
  168587773: "blast-sepolia",
};

// Chain subdomain segment used when composing a QuickNode URL from
// NEXT_PUBLIC_QUICKNODE_KEY. The literal "{chain}" placeholder in the template
// expands to one of these strings; Ethereum mainnet uses an empty segment
// because QN serves it directly off <endpoint>.quiknode.pro.
const quicknodeSlugByChainId: Record<number, string> = {
  1: "",
  10: ".optimism",
  137: ".matic",
  8453: ".base-mainnet",
  42161: ".arbitrum-mainnet",
  80002: ".matic-amoy",
  81457: ".blast-mainnet",
  11155111: ".ethereum-sepolia",
  168587773: ".blast-sepolia",
};

function buildAlchemyUrl(chainId: number, key: string): string | undefined {
  const slug = alchemySlugByChainId[chainId];
  if (!slug) return undefined;
  return `https://${slug}.g.alchemy.com/v2/${key}`;
}

function buildQuicknodeUrl(
  chainId: number,
  template: string,
): string | undefined {
  const slug = quicknodeSlugByChainId[chainId];
  if (slug === undefined) return undefined;
  return template.replace("{chain}", slug);
}

// Per-chain override lookup. Statically referenced so Next.js inlines each
// value into the client bundle.
function getProviderOverride(chainId: number, env: Env): string | undefined {
  switch (chainId) {
    case 1:
      return env.NEXT_PUBLIC_PROVIDER_1;
    case 5:
      return env.NEXT_PUBLIC_PROVIDER_5;
    case 10:
      return env.NEXT_PUBLIC_PROVIDER_10;
    case 137:
      return env.NEXT_PUBLIC_PROVIDER_137;
    case 288:
      return env.NEXT_PUBLIC_PROVIDER_288;
    case 1514:
      return env.NEXT_PUBLIC_PROVIDER_1514;
    case 1516:
      return env.NEXT_PUBLIC_PROVIDER_1516;
    case 8453:
      return env.NEXT_PUBLIC_PROVIDER_8453;
    case 42161:
      return env.NEXT_PUBLIC_PROVIDER_42161;
    case 80001:
      return env.NEXT_PUBLIC_PROVIDER_80001;
    case 80002:
      return env.NEXT_PUBLIC_PROVIDER_80002;
    case 81457:
      return env.NEXT_PUBLIC_PROVIDER_81457;
    case 11155111:
      return env.NEXT_PUBLIC_PROVIDER_11155111;
    case 168587773:
      return env.NEXT_PUBLIC_PROVIDER_168587773;
    default:
      return undefined;
  }
}

// Resolves the RPC URL for a chain in priority order:
//   1. NEXT_PUBLIC_PROVIDER_<chainId> override
//   2. Alchemy (if NEXT_PUBLIC_ALCHEMY_KEY is set and the chain is supported)
//   3. QuickNode (if NEXT_PUBLIC_QUICKNODE_KEY is set and the chain is supported)
function resolveProviderUrl(chainId: number, env: Env): string | undefined {
  const override = getProviderOverride(chainId, env);
  if (override) return override;
  if (env.NEXT_PUBLIC_ALCHEMY_KEY) {
    const url = buildAlchemyUrl(chainId, env.NEXT_PUBLIC_ALCHEMY_KEY);
    if (url) return url;
  }
  if (env.NEXT_PUBLIC_QUICKNODE_KEY) {
    const url = buildQuicknodeUrl(chainId, env.NEXT_PUBLIC_QUICKNODE_KEY);
    if (url) return url;
  }
  return undefined;
}

function buildProviders(env: Env): ProviderConfigs {
  const providers: ProviderConfigs = [];
  const seen = new Set<string>();
  for (const contract of ContractInfoList) {
    if (contract.type === "Erc20") continue;
    const seenKey = `${contract.chainId}:${contract.type}`;
    if (seen.has(seenKey)) continue;
    const url = resolveProviderUrl(contract.chainId, env);
    if (!url) continue;
    const provider = {
      source: "provider",
      type: contract.type,
      url,
      chainId: contract.chainId,
      address: contract.address,
      deployBlock: contract.deployBlock,
      blockHistoryLimit: 1000000,
    };
    if (ss.is(provider, ProviderConfig)) {
      providers.push(provider);
      seen.add(seenKey);
    }
  }
  return providers;
}

function buildSubgraphs(env: Env): SubgraphConfigs {
  const subgraphs: SubgraphConfigs = [];
  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;
    if (!key.startsWith("NEXT_PUBLIC_SUBGRAPH_")) continue;
    const [, version, chainIdStr] = key
      .replace("NEXT_PUBLIC_SUBGRAPH_", "")
      .match(/^(V1|V2|V3|SKINNY|MANAGED)_(\d+)$/) ?? [
      undefined,
      undefined,
      undefined,
    ];
    if (!version || !chainIdStr) continue;
    const chainId = parseInt(chainIdStr);
    const urls = value.split(",").map((x) => x.trim());
    let type: string;
    if (version === "SKINNY") type = "Skinny Optimistic Oracle";
    else if (version === "MANAGED") type = "Managed Optimistic Oracle V2";
    else type = `Optimistic Oracle ${version}`;
    // Not every oracle version is deployed on every chain (e.g. no Skinny on
    // Blast Sepolia). Skip the subgraph entry instead of throwing at module
    // init when the contract address is missing.
    let address: string;
    try {
      address = getContractAddress({ chainId, type });
    } catch {
      continue;
    }
    const subgraph = {
      source: "gql",
      urls,
      type,
      chainId,
      address,
    };
    if (ss.is(subgraph, SubgraphConfig)) {
      subgraphs.push(subgraph);
    }
  }
  return subgraphs;
}

function parseEnv(env: Env): Config {
  return {
    simulationEndpoint: env.NEXT_PUBLIC_SIMULATION_ENDPOINT,
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
    walletconnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    defaultLiveness: env.NEXT_PUBLIC_DEFAULT_LIVENESS ?? "7600",
    subgraphs: buildSubgraphs(env),
    providers: buildProviders(env),
    maxSettledRequests: env.NEXT_PUBLIC_MAX_SETTLED_REQUESTS ?? "1000",
    showManagedOracleBanner:
      env.NEXT_PUBLIC_SHOW_MANAGED_ORACLE_BANNER === "true",
  };
}

export const config = parseEnv(env);
