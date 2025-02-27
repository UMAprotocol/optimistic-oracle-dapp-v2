import { getContractAddress, getContractInfo } from "@libs/constants";
import * as ss from "superstruct";

const Env = ss.object({
  NEXT_PUBLIC_DEFAULT_APY: ss.optional(ss.string()),
  NEXT_PUBLIC_INFURA_ID: ss.string(),
  NEXT_PUBLIC_DEFAULT_LIVENESS: ss.string(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ss.string(),
  NEXT_PUBLIC_SIMULATION_ENDPOINT: ss.string(),
  // mainnet
  NEXT_PUBLIC_SUBGRAPH_V1_1: ss.optional(ss.string()),
  // optimism
  NEXT_PUBLIC_SUBGRAPH_V1_10: ss.optional(ss.string()),
  // polygon
  NEXT_PUBLIC_SUBGRAPH_V1_137: ss.optional(ss.string()),
  // boba
  NEXT_PUBLIC_SUBGRAPH_V1_288: ss.optional(ss.string()),
  // core
  NEXT_PUBLIC_SUBGRAPH_V1_1116: ss.optional(ss.string()),
  // arbitrum
  NEXT_PUBLIC_SUBGRAPH_V1_42161: ss.optional(ss.string()),
  // goerli
  NEXT_PUBLIC_SUBGRAPH_V1_5: ss.optional(ss.string()),
  // mumbai
  NEXT_PUBLIC_SUBGRAPH_V1_80001: ss.optional(ss.string()),
  // amoy
  NEXT_PUBLIC_SUBGRAPH_V1_80002: ss.optional(ss.string()),
  // blast
  NEXT_PUBLIC_SUBGRAPH_V1_81457: ss.optional(ss.string()),
  // sepolia
  NEXT_PUBLIC_SUBGRAPH_V1_11155111: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V2_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_168587773: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V3_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_168587773: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_SKINNY_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_5: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773: ss.optional(ss.string()),

  // enabling services for realtime updates oo v1
  NEXT_PUBLIC_PROVIDER_V1_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_168587773: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_1516: ss.optional(ss.string()),

  // enabling services for realtime updates oo v2
  NEXT_PUBLIC_PROVIDER_V2_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_168587773: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_1516: ss.optional(ss.string()),

  // enabling services for realtime updates oo v3
  NEXT_PUBLIC_PROVIDER_V3_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_168587773: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_1516: ss.optional(ss.string()),

  NEXT_PUBLIC_PROVIDER_SKINNY_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_1116: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_80001: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_80002: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_81457: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_11155111: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_168587773: ss.optional(ss.string()),
  // not supported yet
  // NEXT_PUBLIC_PROVIDER_V1_416: ss.optional(ss.string()),
  // NEXT_PUBLIC_PROVIDER_V1_43114: ss.optional(ss.string()),
  // NEXT_PUBLIC_PROVIDER_V1_80001: ss.optional(ss.string()),
  // NEXT_PUBLIC_SUBGRAPH_V3_168587773: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V1_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_8453: ss.optional(ss.string()),

  NEXT_PUBLIC_PROVIDER_V1_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_8453: ss.optional(ss.string()),
  NEXT_PUBLIC_MAX_SETTLED_REQUESTS: ss.optional(ss.string()),
});
export type Env = ss.Infer<typeof Env>;

// every prop of next envs needs to be explicitly pulled in
const env = ss.create(
  {
    NEXT_PUBLIC_DEFAULT_APY: process.env.NEXT_PUBLIC_DEFAULT_APY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_SIMULATION_ENDPOINT:
      process.env.NEXT_PUBLIC_SIMULATION_ENDPOINT,
    NEXT_PUBLIC_SUBGRAPH_V1_1: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1,
    NEXT_PUBLIC_SUBGRAPH_V1_10: process.env.NEXT_PUBLIC_SUBGRAPH_V1_10,
    NEXT_PUBLIC_SUBGRAPH_V1_137: process.env.NEXT_PUBLIC_SUBGRAPH_V1_137,
    NEXT_PUBLIC_SUBGRAPH_V1_288: process.env.NEXT_PUBLIC_SUBGRAPH_V1_288,
    NEXT_PUBLIC_SUBGRAPH_V1_1116: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1116,
    NEXT_PUBLIC_SUBGRAPH_V1_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
    NEXT_PUBLIC_SUBGRAPH_V1_5: process.env.NEXT_PUBLIC_SUBGRAPH_V1_5,
    NEXT_PUBLIC_SUBGRAPH_V1_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V1_80001,
    NEXT_PUBLIC_SUBGRAPH_V1_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V1_80002,
    NEXT_PUBLIC_SUBGRAPH_V1_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V1_81457,
    NEXT_PUBLIC_SUBGRAPH_V1_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V1_11155111,
    // NEXT_PUBLIC_SUBGRAPH_V1_168587773:
    //   process.env.NEXT_PUBLIC_SUBGRAPH_V1_168587773,

    NEXT_PUBLIC_SUBGRAPH_V2_1: process.env.NEXT_PUBLIC_SUBGRAPH_V2_1,
    NEXT_PUBLIC_SUBGRAPH_V2_10: process.env.NEXT_PUBLIC_SUBGRAPH_V2_10,
    NEXT_PUBLIC_SUBGRAPH_V2_137: process.env.NEXT_PUBLIC_SUBGRAPH_V2_137,
    NEXT_PUBLIC_SUBGRAPH_V2_288: process.env.NEXT_PUBLIC_SUBGRAPH_V2_288,
    NEXT_PUBLIC_SUBGRAPH_V2_1116: process.env.NEXT_PUBLIC_SUBGRAPH_V2_1116,
    NEXT_PUBLIC_SUBGRAPH_V2_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V2_42161,
    NEXT_PUBLIC_SUBGRAPH_V2_5: process.env.NEXT_PUBLIC_SUBGRAPH_V2_5,
    NEXT_PUBLIC_SUBGRAPH_V2_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V2_80001,
    NEXT_PUBLIC_SUBGRAPH_V2_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V2_80002,
    NEXT_PUBLIC_SUBGRAPH_V2_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V2_81457,
    NEXT_PUBLIC_SUBGRAPH_V2_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V2_11155111,
    // NEXT_PUBLIC_SUBGRAPH_V2_168587773:
    //   process.env.NEXT_PUBLIC_SUBGRAPH_V2_168587773,

    NEXT_PUBLIC_SUBGRAPH_V3_1: process.env.NEXT_PUBLIC_SUBGRAPH_V3_1,
    NEXT_PUBLIC_SUBGRAPH_V3_10: process.env.NEXT_PUBLIC_SUBGRAPH_V3_10,
    NEXT_PUBLIC_SUBGRAPH_V3_137: process.env.NEXT_PUBLIC_SUBGRAPH_V3_137,
    NEXT_PUBLIC_SUBGRAPH_V3_288: process.env.NEXT_PUBLIC_SUBGRAPH_V3_288,
    NEXT_PUBLIC_SUBGRAPH_V3_1116: process.env.NEXT_PUBLIC_SUBGRAPH_V3_1116,
    NEXT_PUBLIC_SUBGRAPH_V3_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V3_42161,
    NEXT_PUBLIC_SUBGRAPH_V3_5: process.env.NEXT_PUBLIC_SUBGRAPH_V3_5,
    NEXT_PUBLIC_SUBGRAPH_V3_80001: process.env.NEXT_PUBLIC_SUBGRAPH_V3_80001,
    NEXT_PUBLIC_SUBGRAPH_V3_80002: process.env.NEXT_PUBLIC_SUBGRAPH_V3_80002,
    NEXT_PUBLIC_SUBGRAPH_V3_81457: process.env.NEXT_PUBLIC_SUBGRAPH_V3_81457,
    NEXT_PUBLIC_SUBGRAPH_V3_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_V3_11155111,
    // NEXT_PUBLIC_SUBGRAPH_V3_168587773:
    //   process.env.NEXT_PUBLIC_SUBGRAPH_V3_168587773,

    NEXT_PUBLIC_SUBGRAPH_SKINNY_1: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_10: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_10,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_137:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_137,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_288:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_288,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_1116:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1116,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_42161:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_42161,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_5: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_5,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_80001:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_80001,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_80002:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_80002,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_81457:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_81457,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_11155111,
    // NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773:
    //   process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_168587773,

    // enabling providers for each chain will enable web3 data services, which are needed for real time updates
    NEXT_PUBLIC_PROVIDER_V1_1: process.env.NEXT_PUBLIC_PROVIDER_V1_1,
    NEXT_PUBLIC_PROVIDER_V1_137: process.env.NEXT_PUBLIC_PROVIDER_V1_137,
    NEXT_PUBLIC_PROVIDER_V1_288: process.env.NEXT_PUBLIC_PROVIDER_V1_288,
    NEXT_PUBLIC_PROVIDER_V1_1116: process.env.NEXT_PUBLIC_PROVIDER_V1_1116,
    NEXT_PUBLIC_PROVIDER_V1_42161: process.env.NEXT_PUBLIC_PROVIDER_V1_42161,
    NEXT_PUBLIC_PROVIDER_V1_5: process.env.NEXT_PUBLIC_PROVIDER_V1_5,
    NEXT_PUBLIC_PROVIDER_V1_10: process.env.NEXT_PUBLIC_PROVIDER_V1_10,
    NEXT_PUBLIC_PROVIDER_V1_80001: process.env.NEXT_PUBLIC_PROVIDER_V1_80001,
    NEXT_PUBLIC_PROVIDER_V1_80002: process.env.NEXT_PUBLIC_PROVIDER_V1_80002,
    NEXT_PUBLIC_PROVIDER_V1_81457: process.env.NEXT_PUBLIC_PROVIDER_V1_81457,
    NEXT_PUBLIC_PROVIDER_V1_11155111:
      process.env.NEXT_PUBLIC_PROVIDER_V1_11155111,
    NEXT_PUBLIC_PROVIDER_V1_1516: process.env.NEXT_PUBLIC_PROVIDER_V1_1516,
    // NEXT_PUBLIC_PROVIDER_V1_168587773:
    //   process.env.NEXT_PUBLIC_PROVIDER_V1_168587773,

    NEXT_PUBLIC_PROVIDER_V2_1: process.env.NEXT_PUBLIC_PROVIDER_V2_1,
    NEXT_PUBLIC_PROVIDER_V2_137: process.env.NEXT_PUBLIC_PROVIDER_V2_137,
    NEXT_PUBLIC_PROVIDER_V2_288: process.env.NEXT_PUBLIC_PROVIDER_V2_288,
    NEXT_PUBLIC_PROVIDER_V2_1116: process.env.NEXT_PUBLIC_PROVIDER_V2_1116,
    NEXT_PUBLIC_PROVIDER_V2_42161: process.env.NEXT_PUBLIC_PROVIDER_V2_42161,
    NEXT_PUBLIC_PROVIDER_V2_5: process.env.NEXT_PUBLIC_PROVIDER_V2_5,
    NEXT_PUBLIC_PROVIDER_V2_10: process.env.NEXT_PUBLIC_PROVIDER_V2_10,
    NEXT_PUBLIC_PROVIDER_V2_80001: process.env.NEXT_PUBLIC_PROVIDER_V2_80001,
    NEXT_PUBLIC_PROVIDER_V2_80002: process.env.NEXT_PUBLIC_PROVIDER_V2_80002,
    NEXT_PUBLIC_PROVIDER_V2_81457: process.env.NEXT_PUBLIC_PROVIDER_V2_81457,
    NEXT_PUBLIC_PROVIDER_V2_11155111:
      process.env.NEXT_PUBLIC_PROVIDER_V2_11155111,
    NEXT_PUBLIC_PROVIDER_V2_168587773:
      process.env.NEXT_PUBLIC_PROVIDER_V2_168587773,
    NEXT_PUBLIC_PROVIDER_V2_1516: process.env.NEXT_PUBLIC_PROVIDER_V2_1516,

    NEXT_PUBLIC_PROVIDER_V3_1: process.env.NEXT_PUBLIC_PROVIDER_V3_1,
    NEXT_PUBLIC_PROVIDER_V3_137: process.env.NEXT_PUBLIC_PROVIDER_V3_137,
    NEXT_PUBLIC_PROVIDER_V3_288: process.env.NEXT_PUBLIC_PROVIDER_V3_288,
    NEXT_PUBLIC_PROVIDER_V3_1116: process.env.NEXT_PUBLIC_PROVIDER_V3_1116,
    NEXT_PUBLIC_PROVIDER_V3_42161: process.env.NEXT_PUBLIC_PROVIDER_V3_42161,
    NEXT_PUBLIC_PROVIDER_V3_5: process.env.NEXT_PUBLIC_PROVIDER_V3_5,
    NEXT_PUBLIC_PROVIDER_V3_10: process.env.NEXT_PUBLIC_PROVIDER_V3_10,
    NEXT_PUBLIC_PROVIDER_V3_80001: process.env.NEXT_PUBLIC_PROVIDER_V3_80001,
    NEXT_PUBLIC_PROVIDER_V3_80002: process.env.NEXT_PUBLIC_PROVIDER_V3_80002,
    NEXT_PUBLIC_PROVIDER_V3_81457: process.env.NEXT_PUBLIC_PROVIDER_V3_81457,
    NEXT_PUBLIC_PROVIDER_V3_11155111:
      process.env.NEXT_PUBLIC_PROVIDER_V3_11155111,
    NEXT_PUBLIC_PROVIDER_V3_168587773:
      process.env.NEXT_PUBLIC_PROVIDER_V3_168587773,
    NEXT_PUBLIC_PROVIDER_V3_1516: process.env.NEXT_PUBLIC_PROVIDER_V3_1516,

    NEXT_PUBLIC_PROVIDER_SKINNY_1: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_1,
    NEXT_PUBLIC_PROVIDER_SKINNY_137:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_137,
    NEXT_PUBLIC_PROVIDER_SKINNY_288:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_288,
    NEXT_PUBLIC_PROVIDER_SKINNY_1116:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_1116,
    NEXT_PUBLIC_PROVIDER_SKINNY_42161:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_42161,
    NEXT_PUBLIC_PROVIDER_SKINNY_5: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_5,
    NEXT_PUBLIC_PROVIDER_SKINNY_10: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_10,
    NEXT_PUBLIC_PROVIDER_SKINNY_80001:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_80001,
    NEXT_PUBLIC_PROVIDER_SKINNY_80002:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_80002,
    NEXT_PUBLIC_PROVIDER_SKINNY_81457:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_81457,
    NEXT_PUBLIC_PROVIDER_SKINNY_11155111:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_11155111,
    // NEXT_PUBLIC_PROVIDER_SKINNY_168587773:
    //   process.env.NEXT_PUBLIC_PROVIDER_SKINNY_168587773,

    // not supported yet
    // NEXT_PUBLIC_PROVIDER_V1_416:   process.env.NEXT_PUBLIC_PROVIDER_V1_416,
    // NEXT_PUBLIC_PROVIDER_V1_43114: process.env.NEXT_PUBLIC_PROVIDER_V1_43114,
    // NEXT_PUBLIC_PROVIDER_V1_80001: process.env.NEXT_PUBLIC_PROVIDER_V1_80001,

    NEXT_PUBLIC_DEFAULT_LIVENESS: process.env.NEXT_PUBLIC_DEFAULT_LIVENESS,

    // base chain
    NEXT_PUBLIC_PROVIDER_V1_8453: process.env.NEXT_PUBLIC_PROVIDER_V1_8453,
    NEXT_PUBLIC_PROVIDER_V2_8453: process.env.NEXT_PUBLIC_PROVIDER_V2_8453,
    NEXT_PUBLIC_PROVIDER_V3_8453: process.env.NEXT_PUBLIC_PROVIDER_V3_8453,
    NEXT_PUBLIC_PROVIDER_SKINNY_8453:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_8453,
    NEXT_PUBLIC_SUBGRAPH_V1_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V1_8453,
    NEXT_PUBLIC_SUBGRAPH_V2_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V2_8453,
    NEXT_PUBLIC_SUBGRAPH_V3_8453: process.env.NEXT_PUBLIC_SUBGRAPH_V3_8453,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_8453:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_8453,
    NEXT_PUBLIC_MAX_SETTLED_REQUESTS:
      process.env.NEXT_PUBLIC_MAX_SETTLED_REQUESTS,
  },
  Env,
);

export const ChainId = ss.enums([
  1, 5, 10, 100, 137, 288, 416, 8453, 11155111, 1116, 42161, 43114, 80001,
  80002, 81457, 168587773, 1516,
]);
const SubgraphConfig = ss.object({
  source: ss.literal("gql"),
  urls: ss.array(ss.string()),
  type: ss.enums([
    "Optimistic Oracle V1",
    "Optimistic Oracle V2",
    "Optimistic Oracle V3",
    "Skinny Optimistic Oracle",
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
});
export type Config = ss.Infer<typeof Config>;

// SUBGRAPH & PROVIDERS vars must be of format "NEXT_PUBLIC_(PROVIDER | SUBGRAPH)_(VERSION | "SKINNY")_(CHAIN_ID)
function parseEnv(env: Env): Config {
  const subgraphs: SubgraphConfigs = [];
  const providers: ProviderConfigs = [];

  for (const [key, value] of Object.entries(env)) {
    if (!value) continue;
    const [item, version, chainId] = key.split("_").slice(-3);
    if (item === "SUBGRAPH") {
      const urls = value.split(",").map((x) => x.trim());
      if (version === "SKINNY") {
        const subgraph = {
          source: "gql",
          urls,
          type: "Skinny Optimistic Oracle",
          chainId: parseInt(chainId),
          address: getContractAddress({
            chainId: parseInt(chainId),
            type: "Skinny Optimistic Oracle",
          }),
        };
        if (ss.is(subgraph, SubgraphConfig)) {
          subgraphs.push(subgraph);
        }
      } else {
        const subgraph = {
          source: "gql",
          urls,
          type: `Optimistic Oracle ${version}`,
          chainId: parseInt(chainId),
          address: getContractAddress({
            chainId: parseInt(chainId),
            type: `Optimistic Oracle ${version}`,
          }),
        };
        if (ss.is(subgraph, SubgraphConfig)) {
          subgraphs.push(subgraph);
        }
      }
    }
    if (item === "PROVIDER") {
      if (version === "SKINNY") {
        const provider = {
          source: "provider",
          type: "Skinny Optimistic Oracle",
          url: value,
          chainId: parseInt(chainId),
          address: getContractAddress({
            chainId: parseInt(chainId),
            type: "Skinny Optimistic Oracle",
          }),
          blockHistoryLimit: 1000000,
        };
        if (ss.is(provider, ProviderConfig)) {
          providers.push(provider);
        }
      } else {
        const contractConfig = getContractInfo({
          chainId: parseInt(chainId),
          type: `Optimistic Oracle ${version}`,
        });
        const provider = {
          source: "provider",
          type: `Optimistic Oracle ${version}`,
          url: value,
          chainId: parseInt(chainId),
          address: contractConfig.address,
          deployBlock: contractConfig.deployBlock,
          blockHistoryLimit: 1000000,
        };
        if (ss.is(provider, ProviderConfig)) {
          providers.push(provider);
        }
      }
    }
  }

  return {
    simulationEndpoint: env.NEXT_PUBLIC_SIMULATION_ENDPOINT,
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
    walletconnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    defaultLiveness: env.NEXT_PUBLIC_DEFAULT_LIVENESS ?? "7600",
    subgraphs,
    providers,
    maxSettledRequests: env.NEXT_PUBLIC_MAX_SETTLED_REQUESTS ?? "5000",
  };
}

export const config = parseEnv(env);
