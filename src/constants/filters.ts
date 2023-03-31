export const keys = [
  "chainName",
  "oracleType",
  "project",
  "title",
  "ancillaryData",
  "decodedAncillaryData",
  "timeUTC",
  "timeFormatted",
  "price",
  "expiryType",
  "currency",
  "formattedBond",
  "formattedReward",
  "assertion",
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
