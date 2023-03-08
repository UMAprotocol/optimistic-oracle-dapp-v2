import { chainsById, config } from "@/constants";
import type { ActionType, ChainId, ChainName, OracleQueryUI } from "@/types";
import type { Assertion, Request, RequestState } from "@shared/types";
import { formatNumberForDisplay } from "@shared/utils";
import { format } from "date-fns";
import type { BigNumber } from "ethers";
import { ethers } from "ethers";

export function utf8ToHex(utf8String: string) {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8String));
}

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
export function toDate(timestamp: number | string) {
  return new Date(toTimeMilliseconds(timestamp));
}
export function toTimeUnix(timestamp: number | string) {
  return Number(timestamp);
}
export function toTimeUTC(timestamp: number | string) {
  return toDate(timestamp).toUTCString();
}
export function toTimeMilliseconds(timestamp: number | string) {
  return toTimeUnix(timestamp) * 1000;
}
export function toTimeFormatted(timestamp: number | string) {
  return format(toTimeMilliseconds(timestamp), "pP");
}

export function getChainName(chainId: number): ChainName {
  if (!isSupportedChain(chainId))
    throw new Error(`Unsupported Chain ${chainId}`);
  return chainsById[chainId];
}
export function isSupportedChain(chainId: number): chainId is ChainId {
  return chainId in chainsById;
}

function getRequestActionType(state: RequestState): ActionType {
  if (state === "Requested") {
    return "Propose";
  }
  if (state === "Proposed") {
    return "Dispute";
  }
  if (state === "Disputed") {
    return "Settle";
  }
}

function getAssertionActionType({
  expirationTime,
  settlementHash,
}: Assertion): ActionType {
  if (settlementHash) return;
  if (toDate(expirationTime) > new Date()) {
    return "Settle";
  }
  return "Dispute";
}

function getLivenessEnds(customLiveness?: string | undefined) {
  const livenessEndsSeconds = customLiveness ?? config.defaultLiveness;
  return toTimeMilliseconds(livenessEndsSeconds);
}

function getPrice(
  proposedPrice: BigNumber | undefined,
  settlementPrice: BigNumber | undefined
) {
  const price = proposedPrice ?? settlementPrice;
  if (price === undefined) return;
  return formatNumberForDisplay(price, { isFormatEther: true });
}

export function requestToOracleQuery({
  id,
  chainId,
  oracleType,
  oracleAddress,
  ancillaryData,
  time,
  identifier,
  proposedPrice,
  settlementPrice,
  currency,
  state,
  reward,
  bond,
  customLiveness,
  eventBased,
}: Request): OracleQueryUI {
  const livenessEndsMilliseconds = getLivenessEnds(customLiveness);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  const decodedIdentifier = decodeHexString(identifier);
  // TODO: we need methods to calculate these things
  // need a lookup for project based on price ident or anc data
  const project = "UMA";
  const title = "Unknown Title";
  const chainName = getChainName(chainId);
  const decodedAncillaryData = decodeAncillaryData(ancillaryData);
  return {
    project,
    title,
    id,
    chainId,
    chainName,
    oracleType,
    oracleAddress,
    identifier,
    decodedIdentifier,
    ancillaryData,
    decodedAncillaryData,
    timeUTC: toTimeUTC(time),
    timeUNIX: toTimeUnix(time),
    timeMilliseconds: toTimeMilliseconds(time),
    timeFormatted: toTimeFormatted(time),
    livenessEndsMilliseconds,
    formattedLivenessEndsIn,
    price: getPrice(proposedPrice, settlementPrice),
    expiryType: eventBased ? "Event-based" : "Time-based",
    tokenAddress: currency,
    bond,
    formattedBond: formatNumberForDisplay(bond, { isFormatEther: true }),
    formattedReward: formatNumberForDisplay(reward, { isFormatEther: true }),
    moreInformation: [],
    actionType: getRequestActionType(state),
    action: () => undefined,
    error: "",
    setError: () => undefined,
  };
}

export function assertionToOracleQuery(assertion: Assertion): OracleQueryUI {
  return {
    id: assertion.id,
    chainId: isSupportedChain(assertion.chainId) ? assertion.chainId : 0,
    chainName: isSupportedChain(assertion.chainId)
      ? getChainName(assertion.chainId)
      : getChainName(0),
    identifier: "",
    decodedIdentifier: "",
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
    actionType: getAssertionActionType(assertion),
    project: "UMA",
    // need contentful? or a standard way to get this from anc data
    title: "Unknown Title",
    // need our user client for actions like this
    action: () => undefined,
    moreInformation: [],
    error: "",
    setError: () => undefined,
    // need lookup from currency address per chain for this
    // need currency decimals for this
    formattedBond: "0",
    formattedReward: "0",
    bond: assertion.bond,
  };
}
