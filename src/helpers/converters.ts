import { chainsById } from "@/constants";
import type { ActionType, ChainId, ChainName, OracleQueryUI } from "@/types";
import { format } from "date-fns";
import { ethers } from "ethers";

import type { Assertion, Request } from "@libs/oracle2";
import { RequestState } from "@libs/oracle2";

export function decodeHexString(hexString: string) {
  try {
    const utf8String = ethers.utils.toUtf8String(hexString);
    // eslint-disable-next-line no-control-regex
    return utf8String.replace(/\u0000/g, "");
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Invalid hex string: ${e.message}`);
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Invalid hex string: ${e}`);
    }
  }
}
export function decodeAncillaryData(ancillaryData: string) {
  try {
    return decodeHexString(ancillaryData);
  } catch (e) {
    return "Unable to decode ancillary data";
  }
}
export function toTimeUnix(timestamp: number | string): number {
  return Number(timestamp);
}
export function toTimeUTC(timestamp: number | string): string {
  return new Date(toTimeUnix(timestamp)).toUTCString();
}
export function toTimeMilliseconds(timestamp: number | string) {
  return toTimeUnix(timestamp) * 1000;
}
export function toTimeFormatted(timestamp: number | string) {
  return format(toTimeMilliseconds(timestamp), "pP");
}

export function requestStateToAction(
  requestState: RequestState
): ActionType | undefined {
  if (requestState === RequestState.Invalid) {
    return undefined;
  }
  if (requestState === RequestState.Requested) {
    return "Propose";
  }
  if (requestState === RequestState.Proposed) {
    return "Dispute";
  }
  if (requestState === RequestState.Expired) {
    return "Settle";
  }
  if (requestState === RequestState.Disputed) {
    return undefined;
  }
  if (requestState === RequestState.Resolved) {
    return "Settle";
  }
  if (requestState === RequestState.Settled) {
    return undefined;
  }
}

export function getChainName(chainId: number): ChainName {
  if (!isSupportedChain(chainId))
    throw new Error(`Unsupported Chain ${chainId}`);
  return chainsById[chainId];
}
export function isSupportedChain(chainId: number): chainId is ChainId {
  return chainId in chainsById;
}

export function requestToOracleQuery(request: Request): OracleQueryUI {
  return {
    id: request.id,
    chainId: isSupportedChain(request.chainId) ? request.chainId : 0,
    chainName: isSupportedChain(request.chainId)
      ? getChainName(request.chainId)
      : getChainName(0),
    oracleType: request.oracleType,
    oracleAddress: request.oracleAddress,
    ancillaryData: request.ancillaryData,
    decodedAncillaryData: decodeAncillaryData(request.ancillaryData),
    timeUTC: toTimeUTC(request.timestamp),
    timeUNIX: toTimeUnix(request.timestamp),
    timeMilliseconds: toTimeMilliseconds(request.timestamp),
    timeFormatted: toTimeFormatted(request.timestamp),
    livenessEndsMilliseconds: request.expirationTime
      ? toTimeMilliseconds(request.expirationTime)
      : undefined,
    formattedLivenessEndsIn: request.expirationTime
      ? toTimeFormatted(request.expirationTime)
      : undefined,
    price: request.price,
    expiryType: request.eventBased ? "Event-based" : "Time-based",
    tokenAddress: request.currency,
    // TODO: we need methods to calculate these things
    // need a lookup for project based on price ident or anc data?
    project: "UMA",
    // need contentful? or a standard way to get this from anc data
    title: "Unknown Title",
    actionType: undefined,
    // need our user client for actions like this
    action: () => undefined,
    moreInformation: [],
    error: "",
    setError: () => undefined,
    assertion: false,
    // need lookup from currency address per chain for this
    currency: "USDC",
    // need currency decimals for this
    formattedBond: request.bond,
    formattedReward: request.reward,
    bond: request.bond,
  };
}

export function assertionToOracleQuery(assertion: Assertion): OracleQueryUI {
  return {
    id: assertion.id,
    chainId: isSupportedChain(assertion.chainId) ? assertion.chainId : 0,
    chainName: isSupportedChain(assertion.chainId)
      ? getChainName(assertion.chainId)
      : getChainName(0),
    oracleType: "Optimistic Oracle V3",
    oracleAddress: assertion.oracleAddress,
    tokenAddress: assertion.currency,
    livenessEndsMilliseconds: assertion.expirationTime
      ? toTimeMilliseconds(assertion.expirationTime)
      : undefined,
    formattedLivenessEndsIn: assertion.expirationTime
      ? toTimeFormatted(assertion.expirationTime)
      : undefined,
    // unknown how to map data below here yet, will need additional work
    ancillaryData: "",
    decodedAncillaryData: "",
    price: assertion.claim,
    timeUTC: toTimeUTC(assertion.assertionTimestamp || "0"),
    timeUNIX: toTimeUnix(assertion.assertionTimestamp || "0"),
    timeMilliseconds: toTimeMilliseconds(assertion.assertionTimestamp || "0"),
    timeFormatted: toTimeFormatted(assertion.assertionTimestamp || "0"),
    expiryType: "Time-based",
    actionType: undefined,
    project: "UMA",
    // need contentful? or a standard way to get this from anc data
    title: "Unknown Title",
    // need our user client for actions like this
    action: () => undefined,
    moreInformation: [],
    error: "",
    setError: () => undefined,
    assertion: true,
    // need lookup from currency address per chain for this
    currency: "USDC",
    // need currency decimals for this
    formattedBond: assertion.bond,
    formattedReward: "0",
    bond: assertion.bond,
  };
}
