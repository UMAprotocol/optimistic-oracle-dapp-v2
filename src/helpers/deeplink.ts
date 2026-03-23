export const DEEPLINK_PARAM_KEYS = [
  "transactionHash",
  "eventIndex",
  "chainId",
  "oracleType",
  // Legacy detail-based params
  "requester",
  "timestamp",
  "identifier",
  "ancillaryData",
] as const;

export type DeeplinkParams = {
  transactionHash: string | null;
  eventIndex: string | null;
  chainId: number | null;
  oracleType: string | null;
};

export type LegacyDeeplinkParams = {
  chainId: number | null;
  oracleType: string | null;
  requester: string | null;
  timestamp: string | null;
  identifier: string | null;
  ancillaryData: string | null;
};

export function parseDeeplinkParams(
  searchParams: { get(name: string): string | null } | null | undefined,
): DeeplinkParams {
  if (!searchParams) {
    return {
      transactionHash: null,
      eventIndex: null,
      chainId: null,
      oracleType: null,
    };
  }
  const chainIdStr = searchParams.get("chainId");
  return {
    transactionHash: searchParams.get("transactionHash"),
    eventIndex: searchParams.get("eventIndex"),
    chainId: chainIdStr ? Number(chainIdStr) : null,
    oracleType: searchParams.get("oracleType"),
  };
}

export function parseLegacyDeeplinkParams(
  searchParams: { get(name: string): string | null } | null | undefined,
): LegacyDeeplinkParams {
  if (!searchParams) {
    return {
      chainId: null,
      oracleType: null,
      requester: null,
      timestamp: null,
      identifier: null,
      ancillaryData: null,
    };
  }
  const chainIdStr = searchParams.get("chainId");
  return {
    chainId: chainIdStr ? Number(chainIdStr) : null,
    oracleType: searchParams.get("oracleType"),
    requester: searchParams.get("requester"),
    timestamp: searchParams.get("timestamp"),
    identifier: searchParams.get("identifier"),
    ancillaryData: searchParams.get("ancillaryData"),
  };
}

export function hasLegacyDeeplinkParams(params: LegacyDeeplinkParams): boolean {
  return !!(
    params.chainId &&
    params.oracleType &&
    params.requester &&
    params.timestamp &&
    params.identifier &&
    params.ancillaryData
  );
}
