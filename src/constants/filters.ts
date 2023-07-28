import type { CheckboxItems, FilterName, OracleQueryUI } from "@/types";
export const keys: (keyof OracleQueryUI)[] = [
  "id",
  "chainId",
  "chainName",
  "oracleType",
  "project",
  "title",
  "description",
  "expiryType",
  "identifier",
  "valueText",
  "timeUTC",
  "timeFormatted",
  "expiryType",
  "tokenAddress",
  "assertionTimestamp",
  "assertionHash",
  "assertionLogIndex",
  "disputeTimestamp",
  "disputeHash",
  "disputeLogIndex",
  "settlementTimestamp",
  "settlementHash",
  "settlementLogIndex",
  "requestTimestamp",
  "requestHash",
  "requestLogIndex",
  "proposalTimestamp",
  "proposalHash",
  "proposalLogIndex",
];

export const filterNames = ["project", "chainName", "oracleType"] as const;

export const emptyFilters = filterNames.reduce(
  (acc, filterName) => {
    acc[filterName] = { All: { checked: true, count: 0 } };
    return acc;
  },
  {} as Record<FilterName, CheckboxItems>,
);

export const emptyCheckedFilters = filterNames.reduce(
  (acc, filterName) => {
    acc[filterName] = [];
    return acc;
  },
  {} as Record<FilterName, string[]>,
);
