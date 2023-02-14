import * as ss from "superstruct";
import { OracleType } from "@libs/oracle2";

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
  },
  Env
);

const SubgraphConfig = ss.object({
  url: ss.string(),
  type: ss.enums([
    OracleType.Optimistic,
    OracleType.Skinny,
    OracleType.OptimisticV2,
    OracleType.Asserter,
  ]),
  chainId: ss.enums([1, 5, 10, 100, 137, 288, 416, 43114, 42161]),
});
export type SubgraphConfig = ss.Infer<typeof SubgraphConfig>;

const SubgraphConfigs = ss.array(SubgraphConfig);
export type SubgraphConfigs = ss.Infer<typeof SubgraphConfigs>;

const Config = ss.object({
  defaultApy: ss.string(),
  infuraId: ss.string(),
  subgraphs: SubgraphConfigs,
});
export type Config = ss.Infer<typeof Config>;

function parseEnv(env: Env): Config {
  const subgraphs: SubgraphConfigs = [];
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_1) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_1,
      type: OracleType.Optimistic,
      chainId: 1,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_10) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_10,
      type: OracleType.Optimistic,
      chainId: 10,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_137) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_137,
      type: OracleType.Optimistic,
      chainId: 137,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_288) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_288,
      type: OracleType.Optimistic,
      chainId: 288,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_42161) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_42161,
      type: OracleType.Optimistic,
      chainId: 42161,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_V1_5) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_V1_5,
      type: OracleType.Optimistic,
      chainId: 5,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_1) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_1,
      type: OracleType.Asserter,
      chainId: 1,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_10) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_10,
      type: OracleType.Asserter,
      chainId: 10,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_137) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_137,
      type: OracleType.Asserter,
      chainId: 137,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_288) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_288,
      type: OracleType.Asserter,
      chainId: 288,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_42161,
      type: OracleType.Asserter,
      chainId: 42161,
    });
  }
  if (env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_5) {
    subgraphs.push({
      url: env.NEXT_PUBLIC_SUBGRAPH_ASSERTER_5,
      type: OracleType.Asserter,
      chainId: 5,
    });
  }
  return {
    defaultApy: env.NEXT_PUBLIC_DEFAULT_APY ?? "30.1",
    infuraId: env.NEXT_PUBLIC_INFURA_ID,
    subgraphs,
  };
}

export const config = parseEnv(env);
