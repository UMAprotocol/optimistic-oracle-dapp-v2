export const DEEPLINK_PARAM_KEYS = [
  "transactionHash",
  "eventIndex",
  "chainId",
  "oracleType",
] as const;

export type DeeplinkParams = {
  transactionHash: string | null;
  eventIndex: string | null;
  chainId: number | null;
  oracleType: string | null;
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
