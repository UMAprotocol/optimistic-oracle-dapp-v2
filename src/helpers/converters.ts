import { config } from "@/constants";
import type { ActionType, MoreInformationItem, OracleQueryUI } from "@/types";
import { chainsById } from "@shared/constants";
import type {
  Assertion,
  ChainId,
  ChainName,
  ParsedOOV2GraphEntity,
  Request,
  RequestState,
} from "@shared/types";
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
export function safeDecodeHexString(hexString: string) {
  try {
    return decodeHexString(hexString);
  } catch (e) {
    return "Unable to decode hex string";
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
  // goes to `propose` page
  if (state === "Requested") {
    return "propose";
  }
  // goes to `verify` page
  if (state === "Proposed") {
    return "dispute";
  }
  // also goes to `verify` page
  if (state === "Disputed" || state === "Expired") {
    return "settle";
  }

  // TODO: figure out what to do with `state === Resolved`
}

function getAssertionActionType({
  expirationTime,
  settlementHash,
}: Assertion): ActionType {
  // goes to `settled` page
  if (settlementHash) return;
  // goes to `verify` page
  if (toDate(expirationTime) > new Date()) {
    return "settle";
  }
  // also goes to `verify` page
  return "dispute";
}

function getLivenessEnds(customLivenessOrExpirationTime?: string | undefined) {
  const livenessEndsSeconds =
    customLivenessOrExpirationTime ??
    Date.now() / 1000 + Number(config.defaultLiveness);
  return toTimeMilliseconds(livenessEndsSeconds);
}

function getPriceRequestValueText(
  proposedPrice: BigNumber | undefined,
  settlementPrice: BigNumber | undefined
) {
  const price = proposedPrice ?? settlementPrice;
  if (price === undefined) return;
  return formatNumberForDisplay(price, { isFormatEther: true });
}

function getFormattedBond(bond: BigNumber | undefined) {
  if (bond === undefined) return "No bond";
  return formatNumberForDisplay(bond, { isFormatEther: true });
}

function getFormattedReward(reward: BigNumber | undefined) {
  if (reward === undefined) return "No reward";
  return formatNumberForDisplay(reward, { isFormatEther: true });
}

function isOOV2PriceRequest(
  request: Request
): request is ParsedOOV2GraphEntity {
  return request.oracleType === "Optimistic Oracle V2";
}

export function requestToOracleQuery(request: Request): OracleQueryUI {
  const {
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
  } = request;
  const {
    bond = undefined,
    customLiveness = undefined,
    eventBased = undefined,
  } = isOOV2PriceRequest(request) ? request : {};
  const livenessEndsMilliseconds = getLivenessEnds(customLiveness);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  // TODO: we need methods to calculate these things
  // need a lookup for project based on price ident or anc data
  const project = "UMA";
  const title = `Price request - ${oracleType}`;
  const chainName = getChainName(chainId);
  const timeUTC = toTimeUTC(time);
  const timeUNIX = toTimeUnix(time);
  const timeMilliseconds = toTimeMilliseconds(time);
  const timeFormatted = toTimeFormatted(time);
  const valueText = getPriceRequestValueText(proposedPrice, settlementPrice);
  const queryTextHex = ancillaryData;
  const queryText = safeDecodeHexString(ancillaryData);
  const expiryType = eventBased ? "Event-based" : "Time-based";
  const tokenAddress = currency;
  const formattedBond = getFormattedBond(bond);
  const formattedReward = getFormattedReward(reward);
  const moreInformation: MoreInformationItem[] = [];
  const actionType = getRequestActionType(state);

  return {
    project,
    title,
    id,
    chainId,
    chainName,
    oracleType,
    oracleAddress,
    identifier,
    queryText,
    queryTextHex,
    timeUTC,
    timeUNIX,
    timeMilliseconds,
    timeFormatted,
    livenessEndsMilliseconds,
    formattedLivenessEndsIn,
    valueText,
    expiryType,
    tokenAddress,
    reward,
    bond,
    formattedBond,
    formattedReward,
    moreInformation,
    actionType,
  };
}

export function assertionToOracleQuery(assertion: Assertion): OracleQueryUI {
  const {
    oracleAddress,
    assertionId,
    chainId,
    identifier,
    expirationTime,
    assertionTimestamp,
    settlementResolution,
    claim,
    currency,
    bond,
  } = assertion;
  const id = assertionId;
  const oracleType = "Optimistic Oracle V3";
  const livenessEndsMilliseconds = getLivenessEnds(expirationTime);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  // TODO: we need methods to calculate these things
  // need a lookup for project based on price ident or anc data
  const project = "UMA";
  const title = `Assertion - ${oracleType}`;
  const chainName = getChainName(chainId);
  const timeUTC = toTimeUTC(assertionTimestamp);
  const timeUNIX = toTimeUnix(assertionTimestamp);
  const timeMilliseconds = toTimeMilliseconds(assertionTimestamp);
  const timeFormatted = toTimeFormatted(assertionTimestamp);
  const valueText = settlementResolution;
  const queryTextHex = claim;
  const queryText = safeDecodeHexString(claim);
  const expiryType = undefined;
  const tokenAddress = currency;
  const formattedBond = formatNumberForDisplay(bond, { isFormatEther: true });
  // no reward is present on assertions
  const reward = undefined;
  const formattedReward = undefined;
  const moreInformation: MoreInformationItem[] = [];
  const actionType = getAssertionActionType(assertion);

  return {
    id,
    chainId,
    chainName,
    identifier,
    oracleType,
    oracleAddress,
    tokenAddress,
    valueText,
    queryText,
    queryTextHex,
    livenessEndsMilliseconds,
    formattedLivenessEndsIn,
    timeUTC,
    timeUNIX,
    timeMilliseconds,
    timeFormatted,
    expiryType,
    actionType,
    project,
    title,
    moreInformation,
    formattedBond,
    formattedReward,
    reward,
    bond,
  };
}
