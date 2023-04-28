import type { OracleQueryUI } from "@/types";
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
  "queryTextHex",
  "queryText",
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

export const emptyFilters = {
  project: { All: { checked: true, count: 0 } },
  chainName: { All: { checked: true, count: 0 } },
  oracleType: { All: { checked: true, count: 0 } },
};

export const emptyCheckedFilters = {
  project: [],
  chainName: [],
  oracleType: [],
};
