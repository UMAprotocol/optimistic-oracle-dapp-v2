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
