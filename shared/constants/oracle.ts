export const oracleTypes = [
  "Optimistic Oracle V1",
  "Optimistic Oracle V2",
  "Optimistic Oracle V3",
  "Skinny Optimistic Oracle",
  "Skinny Optimistic Oracle V2",
] as const;

export const expiryTypes = ["Event-based", "Time-based"] as const;

export const projects = [
  "Unknown",
  "Polymarket",
  "PolyBet",
  "Cozy Finance",
  "Across",
  "Sherlock",
  "OSnap",
  "Rated",
] as const;

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
  0: "Unsupported Chain",
  1: "Ethereum",
  5: "Goerli",
  10: "Optimism",
  100: "Gnosis",
  137: "Polygon",
  288: "Boba",
  416: "SX",
  1116: "Core",
  43114: "Avalanche",
  42161: "Arbitrum",
  80001: "Mumbai",
  11155111: "Sepolia",
} as const;

export const chainNames = Object.values(chainsById);

