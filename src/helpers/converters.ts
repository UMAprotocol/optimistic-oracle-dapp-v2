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
import { erc20ABI } from "wagmi";

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
  return format(toTimeMilliseconds(timestamp), "Pp");
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

  return null;
}

function getAssertionActionType({
  expirationTime,
  settlementHash,
}: Assertion): ActionType {
  // goes to `settled` page
  if (settlementHash) return null;
  // goes to `verify` page
  if (toDate(expirationTime) > new Date()) {
    return "settle";
  }
  // also goes to `verify` page
  return "dispute";
}

function getLivenessEnds(customLivenessOrExpirationTime?: string | null) {
  const livenessEndsSeconds =
    customLivenessOrExpirationTime ??
    Date.now() / 1000 + Number(config.defaultLiveness);
  return toTimeMilliseconds(livenessEndsSeconds);
}

function getPriceRequestValueText(
  proposedPrice: BigNumber | null,
  settlementPrice: BigNumber | null
) {
  const price = proposedPrice ?? settlementPrice;
  if (price === null) return null;
  return formatNumberForDisplay(price, { isFormatEther: true });
}

function getFormattedBond(bond: BigNumber | null) {
  if (bond === null) return null;
  return formatNumberForDisplay(bond, { isFormatEther: true });
}

function getFormattedReward(reward: BigNumber | null) {
  if (reward === null) return null;
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
    bond = null,
    customLiveness = null,
    eventBased = null,
  } = isOOV2PriceRequest(request) ? request : {};
  const livenessEndsMilliseconds = getLivenessEnds(customLiveness);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  // TODO: we need methods to calculate these things
  // need a lookup for project based on price ident or anc data
  const project = "UMA";
  const title = `Price request - ${identifier} - ${oracleType}`;
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
  const approveBondSpendParams = !!bond
    ? {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "approve" as const,
        chainId,
        args: [oracleAddress, bond] as const,
      }
    : null;

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
    approveBondSpendParams,
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
  const title = `Assertion - ${identifier} - ${oracleType}`;
  const chainName = getChainName(chainId);
  const timeUTC = toTimeUTC(assertionTimestamp);
  const timeUNIX = toTimeUnix(assertionTimestamp);
  const timeMilliseconds = toTimeMilliseconds(assertionTimestamp);
  const timeFormatted = toTimeFormatted(assertionTimestamp);
  const valueText = settlementResolution;
  const queryTextHex = claim;
  const queryText = safeDecodeHexString(claim);
  const expiryType = null;
  const tokenAddress = currency;
  const formattedBond = formatNumberForDisplay(bond, { isFormatEther: true });
  // no reward is present on assertions
  const reward = null;
  const formattedReward = null;
  const moreInformation: MoreInformationItem[] = [];
  const actionType = getAssertionActionType(assertion);
  const approveBondSpendParams = !!bond
    ? {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: "approve" as const,
        chainId,
        args: [oracleAddress, bond] as const,
      }
    : null;

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
    approveBondSpendParams,
  };
}
