import {
  getOptimisticOracleAbi,
  getOptimisticOracleV2Abi,
  getOptimisticOracleV3Abi,
  getSkinnyOptimisticOracleAbi,
} from "@uma/contracts-frontend";

export const currencies = ["USDC", "ETH", "RY"] as const;

export const oracleTypes = [
  "Optimistic Oracle V1",
  "Optimistic Oracle V2",
  "Optimistic Oracle V3",
  "Skinny Optimistic Oracle",
] as const;

export const expiryTypes = ["Event-based", "Time-based"] as const;

export const projects = ["UMA", "Polymarket", "Cozy Finance"] as const;

export const requestStates = [
  "Invalid",
  "Requested",
  "Proposed",
  "Expired",
  "Disputed",
  "Resolved",
  "Settled",
] as const;

export const chainsById = {
  0: "Unsupported Chain" as const,
  1: "Ethereum" as const,
  5: "Goerli" as const,
  10: "Optimism" as const,
  100: "Gnosis" as const,
  137: "Polygon" as const,
  288: "Boba" as const,
  416: "SX" as const,
  43114: "Avalanche" as const,
  42161: "Arbitrum" as const,
  80001: "Mumbai" as const,
};

export const chainNames = Object.values(chainsById);

export const ooV1Abi = getOptimisticOracleAbi();
export const oov2Abi = getOptimisticOracleV2Abi();
export const oov3Abi = getOptimisticOracleV3Abi();
export const skinnyAbi = getSkinnyOptimisticOracleAbi();
