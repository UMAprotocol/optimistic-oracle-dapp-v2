import { getContractAddress } from "@libs/constants";
import * as ss from "superstruct";

const Env = ss.object({
  NEXT_PUBLIC_DEFAULT_APY: ss.optional(ss.string()),
  NEXT_PUBLIC_INFURA_ID: ss.string(),
  NEXT_PUBLIC_DEFAULT_LIVENESS: ss.string(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: ss.string(),
  // mainnet
  NEXT_PUBLIC_SUBGRAPH_V1_1: ss.optional(ss.string()),
  // optimism
  NEXT_PUBLIC_SUBGRAPH_V1_10: ss.optional(ss.string()),
  // polygon
  NEXT_PUBLIC_SUBGRAPH_V1_137: ss.optional(ss.string()),
  // boba
  NEXT_PUBLIC_SUBGRAPH_V1_288: ss.optional(ss.string()),
  // arbitrum
  NEXT_PUBLIC_SUBGRAPH_V1_42161: ss.optional(ss.string()),
  // goerli
  NEXT_PUBLIC_SUBGRAPH_V1_5: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V2_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V2_5: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_V3_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_V3_5: ss.optional(ss.string()),

  NEXT_PUBLIC_SUBGRAPH_SKINNY_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_SKINNY_5: ss.optional(ss.string()),

  // enabling services for realtime updates oo v1
  NEXT_PUBLIC_PROVIDER_V1_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V1_10: ss.optional(ss.string()),

  // enabling services for realtime updates oo v2
  NEXT_PUBLIC_PROVIDER_V2_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V2_10: ss.optional(ss.string()),

  // enabling services for realtime updates oo v3
  NEXT_PUBLIC_PROVIDER_V3_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_V3_10: ss.optional(ss.string()),

  NEXT_PUBLIC_PROVIDER_SKINNY_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_SKINNY_5: ss.optional(ss.string()),
  // not supported yet
  // NEXT_PUBLIC_PROVIDER_V1_416: ss.optional(ss.string()),
  // NEXT_PUBLIC_PROVIDER_V1_43114: ss.optional(ss.string()),
  // NEXT_PUBLIC_PROVIDER_V1_80001: ss.optional(ss.string()),
});
export type Env = ss.Infer<typeof Env>;

// every prop of next envs needs to be explicitly pulled in
const env = ss.create(
  {
    NEXT_PUBLIC_DEFAULT_APY: process.env.NEXT_PUBLIC_DEFAULT_APY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_SUBGRAPH_V1_1: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1,
    NEXT_PUBLIC_SUBGRAPH_V1_10: process.env.NEXT_PUBLIC_SUBGRAPH_V1_10,
    NEXT_PUBLIC_SUBGRAPH_V1_137: process.env.NEXT_PUBLIC_SUBGRAPH_V1_137,
    NEXT_PUBLIC_SUBGRAPH_V1_288: process.env.NEXT_PUBLIC_SUBGRAPH_V1_288,
    NEXT_PUBLIC_SUBGRAPH_V1_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
    NEXT_PUBLIC_SUBGRAPH_V1_5: process.env.NEXT_PUBLIC_SUBGRAPH_V1_5,

    NEXT_PUBLIC_SUBGRAPH_V2_1: process.env.NEXT_PUBLIC_SUBGRAPH_V2_1,
    NEXT_PUBLIC_SUBGRAPH_V2_10: process.env.NEXT_PUBLIC_SUBGRAPH_V2_10,
    NEXT_PUBLIC_SUBGRAPH_V2_137: process.env.NEXT_PUBLIC_SUBGRAPH_V2_137,
    NEXT_PUBLIC_SUBGRAPH_V2_288: process.env.NEXT_PUBLIC_SUBGRAPH_V2_288,
    NEXT_PUBLIC_SUBGRAPH_V2_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V2_42161,
    NEXT_PUBLIC_SUBGRAPH_V2_5: process.env.NEXT_PUBLIC_SUBGRAPH_V2_5,

    NEXT_PUBLIC_SUBGRAPH_V3_1: process.env.NEXT_PUBLIC_SUBGRAPH_V3_1,
    NEXT_PUBLIC_SUBGRAPH_V3_10: process.env.NEXT_PUBLIC_SUBGRAPH_V3_10,
    NEXT_PUBLIC_SUBGRAPH_V3_137: process.env.NEXT_PUBLIC_SUBGRAPH_V3_137,
    NEXT_PUBLIC_SUBGRAPH_V3_288: process.env.NEXT_PUBLIC_SUBGRAPH_V3_288,
    NEXT_PUBLIC_SUBGRAPH_V3_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V3_42161,
    NEXT_PUBLIC_SUBGRAPH_V3_5: process.env.NEXT_PUBLIC_SUBGRAPH_V3_5,

    NEXT_PUBLIC_SUBGRAPH_SKINNY_1: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_10: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_10,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_137:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_137,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_288:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_288,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_42161:
      process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_42161,
    NEXT_PUBLIC_SUBGRAPH_SKINNY_5: process.env.NEXT_PUBLIC_SUBGRAPH_SKINNY_5,

    // enabling providers for each chain will enable web3 data services, which are needed for real time updates
    NEXT_PUBLIC_PROVIDER_V1_1: process.env.NEXT_PUBLIC_PROVIDER_V1_1,
    NEXT_PUBLIC_PROVIDER_V1_137: process.env.NEXT_PUBLIC_PROVIDER_V1_137,
    NEXT_PUBLIC_PROVIDER_V1_288: process.env.NEXT_PUBLIC_PROVIDER_V1_288,
    NEXT_PUBLIC_PROVIDER_V1_42161: process.env.NEXT_PUBLIC_PROVIDER_V1_42161,
    NEXT_PUBLIC_PROVIDER_V1_5: process.env.NEXT_PUBLIC_PROVIDER_V1_5,
    NEXT_PUBLIC_PROVIDER_V1_10: process.env.NEXT_PUBLIC_PROVIDER_V1_10,
    NEXT_PUBLIC_PROVIDER_V2_1: process.env.NEXT_PUBLIC_PROVIDER_V2_1,
    NEXT_PUBLIC_PROVIDER_V2_137: process.env.NEXT_PUBLIC_PROVIDER_V2_137,
    NEXT_PUBLIC_PROVIDER_V2_288: process.env.NEXT_PUBLIC_PROVIDER_V2_288,
    NEXT_PUBLIC_PROVIDER_V2_42161: process.env.NEXT_PUBLIC_PROVIDER_V2_42161,
    NEXT_PUBLIC_PROVIDER_V2_5: process.env.NEXT_PUBLIC_PROVIDER_V2_5,
    NEXT_PUBLIC_PROVIDER_V2_10: process.env.NEXT_PUBLIC_PROVIDER_V2_10,
    NEXT_PUBLIC_PROVIDER_V3_1: process.env.NEXT_PUBLIC_PROVIDER_V3_1,
    NEXT_PUBLIC_PROVIDER_V3_137: process.env.NEXT_PUBLIC_PROVIDER_V3_137,
    NEXT_PUBLIC_PROVIDER_V3_288: process.env.NEXT_PUBLIC_PROVIDER_V3_288,
    NEXT_PUBLIC_PROVIDER_V3_42161: process.env.NEXT_PUBLIC_PROVIDER_V3_42161,
    NEXT_PUBLIC_PROVIDER_V3_5: process.env.NEXT_PUBLIC_PROVIDER_V3_5,
    NEXT_PUBLIC_PROVIDER_V3_10: process.env.NEXT_PUBLIC_PROVIDER_V3_10,
    NEXT_PUBLIC_PROVIDER_SKINNY_1: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_1,
    NEXT_PUBLIC_PROVIDER_SKINNY_137:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_137,
    NEXT_PUBLIC_PROVIDER_SKINNY_288:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_288,
    NEXT_PUBLIC_PROVIDER_SKINNY_42161:
      process.env.NEXT_PUBLIC_PROVIDER_SKINNY_42161,
    NEXT_PUBLIC_PROVIDER_SKINNY_5: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_5,
    NEXT_PUBLIC_PROVIDER_SKINNY_10: process.env.NEXT_PUBLIC_PROVIDER_SKINNY_10,
    // not supported yet
    // NEXT_PUBLIC_PROVIDER_V1_416:   process.env.NEXT_PUBLIC_PROVIDER_V1_416,
    // NEXT_PUBLIC_PROVIDER_V1_43114: process.env.NEXT_PUBLIC_PROVIDER_V1_43114,
    // NEXT_PUBLIC_PROVIDER_V1_80001: process.env.NEXT_PUBLIC_PROVIDER_V1_80001,

    NEXT_PUBLIC_DEFAULT_LIVENESS: process.env.NEXT_PUBLIC_DEFAULT_LIVENESS,
  },
  Env,
);

export const ChainId = ss.enums([
  1, 5, 10, 100, 137, 288, 416, 42161, 43114, 80001,
]);
const SubgraphConfig = ss.object({
  source: ss.literal("gql"),
  url: ss.string(),
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
  blockHistoryLimit: ss.number(),
});
export type ProviderConfig = ss.Infer<typeof ProviderConfig>;
const ProviderConfigs = ss.array(ProviderConfig);
export type ProviderConfigs = ss.Infer<typeof ProviderConfigs>;

const Config = ss.object({
  defaultApy: ss.string(),
  infuraId: ss.string(),
  walletconnectProjectId: ss.string(),
  defaultLiveness: ss.string(),
  subgraphs: SubgraphConfigs,
  providers: ProviderConfigs,
});
export type Config = ss.Infer<typeof Config>;

function parseEnv(env: Env): Config {
  const subgraphs: SubgraphConfigs = [];
  const providers: ProviderConfigs = [];
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_1) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_1,
      type: "Optimistic Oracle V1",
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V1" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_10) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_10,
      type: "Optimistic Oracle V1",
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V1",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_137) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_137,
      type: "Optimistic Oracle V1",
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V1",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_288) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_288,
      type: "Optimistic Oracle V1",
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V1",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_42161) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
      type: "Optimistic Oracle V1",
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V1",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_5) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_5,
      type: "Optimistic Oracle V1",
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V1" }),
    });
  }

  if (env.NEXT_PUBLIC_SUBGRAPH_V2_1) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_1,
      type: "Optimistic Oracle V2",
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V2" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V2_10) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_10,
      type: "Optimistic Oracle V2",
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V2",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V2_137) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_137,
      type: "Optimistic Oracle V2",
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V2",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V2_288) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_288,
      type: "Optimistic Oracle V2",
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V2",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V2_42161) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_42161,
      type: "Optimistic Oracle V2",
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V2",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V2_5) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V2_5,
      type: "Optimistic Oracle V2",
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V2" }),
    });
  }

  if (env.NEXT_PUBLIC_SUBGRAPH_V3_1) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_1,
      type: "Optimistic Oracle V3",
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V3" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V3_10) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_10,
      type: "Optimistic Oracle V3",
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V3",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V3_137) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_137,
      type: "Optimistic Oracle V3",
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V3",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V3_288) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_288,
      type: "Optimistic Oracle V3",
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V3",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V3_42161) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_42161,
      type: "Optimistic Oracle V3",
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V3",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V3_5) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_V3_5,
      type: "Optimistic Oracle V3",
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V3" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_1,
      type: "Skinny Optimistic Oracle",
      chainId: 1,
      address: getContractAddress({
        chainId: 1,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_10) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_10,
      type: "Skinny Optimistic Oracle",
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_137) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_137,
      type: "Skinny Optimistic Oracle",
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_288) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_288,
      type: "Skinny Optimistic Oracle",
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_42161) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_42161,
      type: "Skinny Optimistic Oracle",
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_SKINNY_5) {
    subgraphs.push({
      source: "gql",
      url: env.NEXT_PUBLIC_SUBGRAPH_SKINNY_5,
      type: "Skinny Optimistic Oracle",
      chainId: 5,
      address: getContractAddress({
        chainId: 5,
        type: "Skinny Optimistic Oracle",
      }),
    });
  }
  // Providers
  if (env.NEXT_PUBLIC_PROVIDER_V1_1) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_1,
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V1" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V1_137) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_137,
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V1",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V1_288) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_288,
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V1",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V1_42161) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_42161,
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V1",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V1_5) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_5,
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V1" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V1_10) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V1",
      url: env.NEXT_PUBLIC_PROVIDER_V1_10,
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V1",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_1) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_1,
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V2" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_137) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_137,
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V2",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_288) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_288,
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V2",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_42161) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_42161,
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V2",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_5) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_5,
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V2" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V2_10) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V2",
      url: env.NEXT_PUBLIC_PROVIDER_V2_10,
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V2",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_1) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_1,
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V3" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_137) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_137,
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Oracle V3",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_288) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_288,
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Oracle V3",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_42161) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_42161,
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Oracle V3",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_5) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_5,
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V3" }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_V3_10) {
    providers.push({
      source: "provider",
      type: "Optimistic Oracle V3",
      url: env.NEXT_PUBLIC_PROVIDER_V3_10,
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Optimistic Oracle V3",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_1) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_1,
      chainId: 1,
      address: getContractAddress({
        chainId: 1,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_137) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_137,
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_288) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_288,
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_42161) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_42161,
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_5) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_5,
      chainId: 5,
      address: getContractAddress({
        chainId: 5,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_SKINNY_10) {
    providers.push({
      source: "provider",
      type: "Skinny Optimistic Oracle",
      url: env.NEXT_PUBLIC_PROVIDER_SKINNY_10,
      chainId: 10,
      address: getContractAddress({
        chainId: 10,
        type: "Skinny Optimistic Oracle",
      }),
      blockHistoryLimit: 100000,
    });
  }
  return {
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
    walletconnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    defaultLiveness: env.NEXT_PUBLIC_DEFAULT_LIVENESS ?? "7600",
    subgraphs,
    providers,
  };
}

export const config = parseEnv(env);
