import * as ss from "superstruct";
import { getContractAddress } from "@libs/constants";

const Env = ss.object({
  NEXT_PUBLIC_DEFAULT_APY: ss.optional(ss.string()),
  NEXT_PUBLIC_INFURA_ID: ss.string(),
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
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_1: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_10: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_137: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_288: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_SUBGRAPH_ASSERTER_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_1: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_137: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_288: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_416: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_42161: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_43114: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_5: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_10: ss.optional(ss.string()),
  NEXT_PUBLIC_PROVIDER_80001: ss.optional(ss.string()),
});
export type Env = ss.Infer<typeof Env>;

// every prop of next envs needs to be explicitly pulled in
const env = ss.create(
  {
    NEXT_PUBLIC_DEFAULT_APY: process.env.NEXT_PUBLIC_DEFAULT_APY,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_SUBGRAPH_V1_1: process.env.NEXT_PUBLIC_SUBGRAPH_V1_1,
    NEXT_PUBLIC_SUBGRAPH_V1_10: process.env.NEXT_PUBLIC_SUBGRAPH_V1_10,
    NEXT_PUBLIC_SUBGRAPH_V1_137: process.env.NEXT_PUBLIC_SUBGRAPH_V1_137,
    NEXT_PUBLIC_SUBGRAPH_V1_288: process.env.NEXT_PUBLIC_SUBGRAPH_V1_288,
    NEXT_PUBLIC_SUBGRAPH_V1_42161: process.env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
    NEXT_PUBLIC_SUBGRAPH_V1_5: process.env.NEXT_PUBLIC_SUBGRAPH_V1_5,

    NEXT_PUBLIC_SUBGRAPH_ASSERTER_1:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_1,
    NEXT_PUBLIC_SUBGRAPH_ASSERTER_10:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_10,
    NEXT_PUBLIC_SUBGRAPH_ASSERTER_137:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_137,
    NEXT_PUBLIC_SUBGRAPH_ASSERTER_288:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_288,
    NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161,
    NEXT_PUBLIC_SUBGRAPH_ASSERTER_5:
      process.env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_5,
    NEXT_PUBLIC_PROVIDER_1: process.env.NEXT_PUBLIC_PROVIDER_1,
    NEXT_PUBLIC_PROVIDER_137: process.env.NEXT_PUBLIC_PROVIDER_137,
    NEXT_PUBLIC_PROVIDER_288: process.env.NEXT_PUBLIC_PROVIDER_288,
    NEXT_PUBLIC_PROVIDER_416: process.env.NEXT_PUBLIC_PROVIDER_416,
    NEXT_PUBLIC_PROVIDER_42161: process.env.NEXT_PUBLIC_PROVIDER_42161,
    NEXT_PUBLIC_PROVIDER_43114: process.env.NEXT_PUBLIC_PROVIDER_43114,
    NEXT_PUBLIC_PROVIDER_5: process.env.NEXT_PUBLIC_PROVIDER_5,
    NEXT_PUBLIC_PROVIDER_10: process.env.NEXT_PUBLIC_PROVIDER_10,
    NEXT_PUBLIC_PROVIDER_80001: process.env.NEXT_PUBLIC_PROVIDER_80001,
  },
  Env
);

const ChainId = ss.enums([1, 5, 10, 100, 137, 288, 416, 42161, 43114, 80001]);
const SubgraphConfig = ss.object({
  url: ss.string(),
  type: ss.enums([
    "Optimistic Oracle V1",
    "Optimistic Oracle V2",
    "Skinny Optimistic Oracle",
    "Optimistic Asserter",
  ]),
  chainId: ChainId,
  address: ss.string(),
});
export type SubgraphConfig = ss.Infer<typeof SubgraphConfig>;

const SubgraphConfigs = ss.array(SubgraphConfig);
export type SubgraphConfigs = ss.Infer<typeof SubgraphConfigs>;

const ProviderConfig = ss.object({
  chainId: ChainId,
  url: ss.string(),
});
export type ProviderConfig = ss.Infer<typeof ProviderConfig>;
const ProviderConfigs = ss.array(ProviderConfig);
export type ProviderConfigs = ss.Infer<typeof ProviderConfigs>;

const Config = ss.object({
  defaultApy: ss.string(),
  infuraId: ss.string(),
  subgraphs: SubgraphConfigs,
  providers: ProviderConfigs,
});
export type Config = ss.Infer<typeof Config>;

function parseEnv(env: Env): Config {
  const subgraphs: SubgraphConfigs = [];
  const providers: ProviderConfigs = [];
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_1) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_1,
      type: "Optimistic Oracle V1",
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Oracle V1" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_10) {
    subgraphs.push({
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
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_5,
      type: "Optimistic Oracle V1",
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Oracle V1" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_1) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_1,
      type: "Optimistic Asserter",
      chainId: 1,
      address: getContractAddress({ chainId: 1, type: "Optimistic Asserter" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_10) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_10,
      type: "Optimistic Asserter",
      chainId: 10,
      address: getContractAddress({ chainId: 10, type: "Optimistic Asserter" }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_137) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_137,
      type: "Optimistic Asserter",
      chainId: 137,
      address: getContractAddress({
        chainId: 137,
        type: "Optimistic Asserter",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_288) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_288,
      type: "Optimistic Asserter",
      chainId: 288,
      address: getContractAddress({
        chainId: 288,
        type: "Optimistic Asserter",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161,
      type: "Optimistic Asserter",
      chainId: 42161,
      address: getContractAddress({
        chainId: 42161,
        type: "Optimistic Asserter",
      }),
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_5) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_5,
      type: "Optimistic Asserter",
      chainId: 5,
      address: getContractAddress({ chainId: 5, type: "Optimistic Asserter" }),
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_1) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_1,
      chainId: 1,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_137) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_137,
      chainId: 137,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_288) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_288,
      chainId: 288,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_416) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_416,
      chainId: 416,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_42161) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_42161,
      chainId: 42161,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_43114) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_43114,
      chainId: 43114,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_5) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_5,
      chainId: 5,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_10) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_10,
      chainId: 10,
    });
  }
  if (env.NEXT_PUBLIC_PROVIDER_80001) {
    providers.push({
      url: env.NEXT_PUBLIC_PROVIDER_80001,
      chainId: 80001,
    });
  }
  return {
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
    subgraphs,
    providers,
  };
}

export const config = parseEnv(env);
