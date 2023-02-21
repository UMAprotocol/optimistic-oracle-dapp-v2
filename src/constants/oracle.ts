export const supportedCurrencies = ["USDC", "ETH", "RY"] as const;

export const oracleTypes = [
  "Optimistic Oracle",
  "Optimistic Oracle V2",
  "Skinny Optimistic Oracle",
  "Optimistic Asserter",
] as const;

export const expiryTypes = ["Event-based", "Time-based"] as const;

export const projects = ["UMA", "Polymarket", "Cozy Finance"] as const;
