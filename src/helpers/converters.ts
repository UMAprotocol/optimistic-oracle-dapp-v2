import { config } from "@/constants";
import type {
  ActionType,
  MoreInformationItem,
  OracleQueryUI,
  SolidityRequest,
} from "@/types";
import { exists, extractSnapshotSpace, parseIdentifier } from "@libs/utils";
import { chainsById } from "@shared/constants";
import {
  disputeAssertionAbi,
  disputePriceAbi,
  proposePriceAbi,
  settleAssertionAbi,
  settlePriceAbi,
  skinnyDisputePriceAbi,
  skinnyProposePriceAbi,
  skinnySettlePriceAbi,
} from "@shared/constants/abi";
import type {
  Assertion,
  ChainId,
  ChainName,
  ParsedOOV1GraphEntity,
  ParsedOOV2GraphEntity,
  Request,
  RequestState,
} from "@shared/types";
import {
  formatNumberForDisplay,
  makeBlockExplorerLink,
  parseEther,
} from "@shared/utils";
import { format } from "date-fns";
import { ethers } from "ethers";
import { upperCase } from "lodash";
import type { Address } from "wagmi";
import { erc20ABI } from "wagmi";
import { formatBytes32String } from "./ethers";
import { getQueryMetaData } from "./queryParsing";
import { isUnresolvable } from "./validators";

export type RequiredRequest = Omit<
  Request,
  "currency" | "bond" | "customLiveness"
> & {
  currency: Address;
  bond: bigint | null | undefined;
  customLiveness: bigint | null | undefined;
};
function canConvertToSolidityRequest(
  request: Request,
): request is RequiredRequest {
  return Boolean(request.currency);
}

function convertToSolidityRequest(request: RequiredRequest): SolidityRequest {
  return {
    proposer: request.proposer || "0x0",
    disputer: request.disputer || "0x0",
    currency: request.currency,
    settled: request.settlementHash ? true : false,
    proposedPrice: request.proposedPrice ? request.proposedPrice : 0n,
    resolvedPrice: request.settlementPrice ? request.settlementPrice : 0n,
    expirationTime: request.proposalExpirationTimestamp
      ? BigInt(request.proposalExpirationTimestamp)
      : 0n,
    reward: request.reward ? request.reward : BigInt(0),
    finalFee: request.finalFee ? request.finalFee : BigInt(0),
    bond: request.bond ? BigInt(request.bond) : BigInt(0),
    customLiveness: request.customLiveness
      ? BigInt(request.customLiveness)
      : BigInt(0),
  };
}

export function utf8ToHex(utf8String: string) {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8String));
}

export function isOptimisticGovernor(decodedAncillaryData: string) {
  return (
    decodedAncillaryData.includes("rules:") &&
    decodedAncillaryData.includes("explanation:")
  );
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

export function toUtcTimeFormatted(timestamp: number | string) {
  const date = new Date(toTimeMilliseconds(timestamp));
  // use user's language but keep it as UTC time
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: "short",
    timeStyle: "short",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
}

export function getChainName(chainId: number): ChainName {
  if (!isSupportedChain(chainId))
    throw new Error(`Unsupported Chain ${chainId}`);
  return chainsById[chainId];
}
export function isSupportedChain(chainId: number): chainId is ChainId {
  return chainId in chainsById;
}

function getRequestActionType(state: RequestState | undefined): ActionType {
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
  if (expirationTime && toDate(expirationTime) < new Date()) {
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
  proposedPrice: bigint | null | undefined,
  settlementPrice: bigint | null | undefined,
) {
  const price = settlementPrice ?? proposedPrice;
  if (price === null || price === undefined) return null;
  return formatNumberForDisplay(price, { isFormatEther: true });
}

function isOOV1PriceRequest(
  request: Request | Assertion,
): request is ParsedOOV1GraphEntity {
  return request.oracleType === "Optimistic Oracle V1";
}

function isOOV2PriceRequest(
  request: Request | Assertion,
): request is ParsedOOV2GraphEntity {
  return request.oracleType === "Optimistic Oracle V2";
}

function isAssertion(request: Request | Assertion): request is Assertion {
  return request.oracleType === "Optimistic Oracle V3";
}

function makeApproveBondSpendParams({
  bond,
  tokenAddress,
  oracleAddress,
  chainId,
}: {
  bond?: bigint;
  tokenAddress?: Address;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  if (!bond || !tokenAddress) return undefined;
  return {
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve" as const,
    chainId,
    args: [oracleAddress, bond] as const,
  };
}

function makeProposePriceParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  return (proposedPrice?: string) => {
    if (!proposedPrice) return;
    if (!bytes32Identifier) return;
    if (!ancillaryData) return;

    // multiple values is pre formatted after user inputs the proposed answers and its already in wei
    // this is the exception to all other identifiers which user inputs in decimals and must be converted to wei
    const proposedPriceFormatted =
      parseIdentifier(bytes32Identifier) === "MULTIPLE_VALUES"
        ? BigInt(proposedPrice)
        : parseEther(proposedPrice).toBigInt();

    return {
      address: oracleAddress,
      abi: proposePriceAbi,
      functionName: "proposePrice" as const,
      chainId,
      args: [
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        proposedPriceFormatted,
      ] as const,
    };
  };
}

function makeProposePriceSkinnyParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
  request,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
  return (proposedPrice?: string) => {
    if (!proposedPrice) return;
    if (!bytes32Identifier) return;
    if (!ancillaryData) return;

    // multiple values is pre formatted after user inputs the proposed answers and its already in wei
    // this is the exception to all other identifiers which user inputs in decimals and must be converted to wei
    const proposedPriceFormatted =
      parseIdentifier(bytes32Identifier) === "MULTIPLE_VALUES"
        ? BigInt(proposedPrice)
        : parseEther(proposedPrice).toBigInt();

    return {
      address: oracleAddress,
      abi: skinnyProposePriceAbi,
      functionName: "proposePrice" as const,
      chainId,
      args: [
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        request,
        proposedPriceFormatted,
      ] as const,
    };
  };
}

function makeDisputePriceSkinnyParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
  request,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
  if (!bytes32Identifier) return;
  if (!ancillaryData) return;
  return {
    address: oracleAddress,
    abi: skinnyDisputePriceAbi,
    functionName: "disputePrice" as const,
    chainId,
    args: [requester, bytes32Identifier, time, ancillaryData, request] as const,
  };
}

function makeDisputePriceParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  if (!bytes32Identifier) return;
  if (!ancillaryData) return;
  return {
    address: oracleAddress,
    abi: disputePriceAbi,
    functionName: "disputePrice" as const,
    chainId,
    args: [requester, bytes32Identifier, time, ancillaryData] as const,
  };
}

function makeSettlePriceParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  if (!bytes32Identifier) return;
  if (!ancillaryData) return;
  return {
    address: oracleAddress,
    abi: settlePriceAbi,
    functionName: "settle" as const,
    chainId,
    args: [requester, bytes32Identifier, time, ancillaryData] as const,
  };
}

function makeSettlePriceSkinnyParams({
  requester,
  bytes32Identifier,
  time,
  ancillaryData,
  oracleAddress,
  chainId,
  request,
}: {
  requester: Address;
  bytes32Identifier?: string;
  time: string;
  ancillaryData?: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
  if (!bytes32Identifier) return;
  if (!ancillaryData) return;
  return {
    address: oracleAddress,
    abi: skinnySettlePriceAbi,
    functionName: "settle" as const,
    chainId,
    args: [requester, bytes32Identifier, time, ancillaryData, request] as const,
  };
}

function makeDisputeAssertionParams({
  assertionId,
  oracleAddress,
  chainId,
}: {
  assertionId: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  return (disputerAddress: Address | undefined) => {
    if (!disputerAddress) return;
    return {
      address: oracleAddress,
      abi: disputeAssertionAbi,
      functionName: "disputeAssertion" as const,
      chainId,
      args: [assertionId, disputerAddress] as const,
    };
  };
}

function makeSettleAssertionParams({
  assertionId,
  oracleAddress,
  chainId,
}: {
  assertionId: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  return {
    address: oracleAddress,
    abi: settleAssertionAbi,
    functionName: "settleAssertion" as const,
    chainId,
    args: [assertionId] as const,
  };
}

function getOOV2SpecificValues(request: Request) {
  const isV2 = isOOV2PriceRequest(request);
  const finalFee = request.finalFee ?? BigInt(0);
  // bond is final fee and bond together
  const bond = isV2 && request.bond ? request.bond + finalFee : finalFee;
  const customLiveness = isV2 ? request.customLiveness : null;
  const eventBased = isV2 ? request.eventBased : null;

  return { bond, customLiveness, eventBased };
}

function makeMoreInformationList(
  query: Request | Assertion,
  umipNumber?: string | undefined,
  umipUrl?: string | undefined,
) {
  const moreInformation: MoreInformationItem[] = [];

  moreInformation.push({
    title: query.oracleType,
    text: query.oracleAddress,
    href: makeBlockExplorerLink(query.oracleAddress, query.chainId, "address"),
  });

  if (umipNumber && umipUrl) {
    moreInformation.push({
      title: "UMIP",
      text: upperCase(umipNumber),
      href: umipUrl,
    });
  }

  if (isOOV1PriceRequest(query) || isOOV2PriceRequest(query)) {
    moreInformation.push(
      {
        title: "Identifier",
        text: query.identifier,
        href: "https://docs.uma.xyz/resources/approved-price-identifiers",
      },
      {
        title: "Requester",
        text: query.requester,
        href: makeBlockExplorerLink(query.requester, query.chainId, "address"),
      },
    );

    if (query.requestHash) {
      moreInformation.push({
        title: "Request Transaction",
        text: query.requestHash,
        href: makeBlockExplorerLink(query.requestHash, query.chainId, "tx"),
      });
    }

    if (query.proposer) {
      moreInformation.push({
        title: "Proposer",
        text: query.proposer,
        href: makeBlockExplorerLink(query.proposer, query.chainId, "address"),
      });
    }

    if (query.proposalHash) {
      moreInformation.push({
        title: "Proposal Transaction",
        text: query.proposalHash,
        href: makeBlockExplorerLink(query.proposalHash, query.chainId, "tx"),
      });
    }

    if (query.disputer) {
      moreInformation.push({
        title: "Disputer",
        text: query.disputer,
        href: makeBlockExplorerLink(query.disputer, query.chainId, "address"),
      });
    }

    if (query.disputeHash) {
      moreInformation.push({
        title: "Dispute Transaction",
        text: query.disputeHash,
        href: makeBlockExplorerLink(query.disputeHash, query.chainId, "tx"),
      });
    }

    if (query.settlementRecipient) {
      moreInformation.push({
        title: "Settlement Recipient",
        text: query.settlementRecipient,
        href: makeBlockExplorerLink(
          query.settlementRecipient,
          query.chainId,
          "address",
        ),
      });
    }

    if (query.settlementHash) {
      moreInformation.push({
        title: "Settlement Transaction",
        text: query.settlementHash,
        href: makeBlockExplorerLink(query.settlementHash, query.chainId, "tx"),
      });
    }
  }

  if (isAssertion(query)) {
    if (query.asserter) {
      moreInformation.push({
        title: "Asserter",
        text: query.asserter,
        href: makeBlockExplorerLink(query.asserter, query.chainId, "address"),
      });
    }
    if (query.escalationManager) {
      moreInformation.push({
        title: "Escalation Manager",
        text: query.escalationManager,
        href: makeBlockExplorerLink(
          query.escalationManager,
          query.chainId,
          "address",
        ),
      });
    }
    if (query.callbackRecipient) {
      moreInformation.push({
        title: "Callback Recipient",
        text: query.callbackRecipient,
        href: makeBlockExplorerLink(
          query.callbackRecipient,
          query.chainId,
          "address",
        ),
      });
    }
    if (query.caller) {
      moreInformation.push({
        title: "Caller",
        text: query.caller,
        href: makeBlockExplorerLink(query.caller, query.chainId, "address"),
      });
    }
    if (query.assertionHash) {
      moreInformation.push({
        title: "Assertion Transaction",
        text: query.assertionHash,
        href: makeBlockExplorerLink(query.assertionHash, query.chainId, "tx"),
      });
    }
    if (query.disputer) {
      moreInformation.push({
        title: "Disputer",
        text: query.disputer,
        href: makeBlockExplorerLink(query.disputer, query.chainId, "address"),
      });
    }
    if (query.disputeHash) {
      moreInformation.push({
        title: "Dispute Transaction",
        text: query.disputeHash,
        href: makeBlockExplorerLink(query.disputeHash, query.chainId, "tx"),
      });
    }
    if (query.settlementRecipient) {
      moreInformation.push({
        title: "Settlement Recipient",
        text: query.settlementRecipient,
        href: makeBlockExplorerLink(
          query.settlementRecipient,
          query.chainId,
          "address",
        ),
      });
    }
    if (query.settlementHash) {
      moreInformation.push({
        title: "Settlement Transaction",
        text: query.settlementHash,
        href: makeBlockExplorerLink(query.settlementHash, query.chainId, "tx"),
      });
    }
  }

  return moreInformation;
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
    requester,
    // searchable properties
    requestTimestamp,
    requestHash,
    requestLogIndex,
    disputeTimestamp,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementHash,
    settlementLogIndex,
    proposalTimestamp,
    proposalHash,
    proposalLogIndex,
    proposalExpirationTimestamp,
  } = request;

  const result: OracleQueryUI = {
    id,
    chainId,
    oracleType,
    oracleAddress,
    chainName: getChainName(chainId),
    actionType: getRequestActionType(state),
    moreInformation: [],
    project: "Unknown",
  };

  if (exists(ancillaryData)) {
    result.queryTextHex = ancillaryData;
    result.queryText = safeDecodeHexString(ancillaryData);
  }

  if (exists(identifier) && exists(result.queryText) && exists(requester)) {
    const { title, description, umipUrl, umipNumber, project, proposeOptions } =
      getQueryMetaData(identifier, result.queryText, requester);
    result.title = title;
    result.description = description;
    result.project = project;
    result.proposeOptions = proposeOptions;
    result.moreInformation = makeMoreInformationList(
      request,
      umipNumber,
      umipUrl,
    );
  }
  if (exists(state)) {
    result.state = state;
  }
  if (exists(reward)) {
    result.reward = reward;
  }
  // With multiple chocie query, values are specified in WEI unlike other identifiers where they are specified in ETh
  if (
    exists(identifier) &&
    parseIdentifier(identifier) === "MULTIPLE_CHOICE_QUERY"
  ) {
    // all our parsing logic assume ether but its not the case for this identifier,
    // so we need to show this as raw eth with no decimal truncation
    const price = settlementPrice ?? proposedPrice;
    if (price === null || price === undefined) {
      result.valueText = "";
    } else {
      result.valueText = ethers.utils.formatEther(price);
    }
    // we need the raw price for multiple values, because we need to parse this into
    // multiple possible price values
  } else if (
    exists(identifier) &&
    parseIdentifier(identifier) === "MULTIPLE_VALUES"
  ) {
    const price = settlementPrice ?? proposedPrice;
    if (price === null || price === undefined || !result.proposeOptions) {
      result.valueText = "-";
    } else {
      // this is an array of strings now representings scores as uints
      result.valueText = decodeMultipleQuery(
        price.toString(),
        result.proposeOptions.length,
      );
    }
  } else {
    result.valueText = getPriceRequestValueText(proposedPrice, settlementPrice);
  }

  let bytes32Identifier = undefined;
  if (exists(identifier)) {
    result.identifier = identifier;
    bytes32Identifier = formatBytes32String(identifier);
  }

  const { bond, eventBased } = getOOV2SpecificValues(request);
  if (exists(bond)) {
    result.bond = bond;
  }
  if (exists(eventBased)) {
    result.expiryType = eventBased ? "Event-based" : "Time-based";
  }

  if (exists(proposalExpirationTimestamp)) {
    result.livenessEndsMilliseconds = getLivenessEnds(
      proposalExpirationTimestamp,
    );
    result.formattedLivenessEndsIn = toTimeFormatted(
      proposalExpirationTimestamp,
    );
  }

  if (exists(time)) {
    result.timeUTC = toTimeUTC(time);
    result.timeUNIX = toTimeUnix(time);
    result.timeMilliseconds = toTimeMilliseconds(time);
    result.timeFormatted = toTimeFormatted(time);
  }
  if (currency) {
    result.tokenAddress = currency;
  }
  if (exists(proposalTimestamp)) {
    result.proposalTimeUTC = toTimeUTC(proposalTimestamp);
    result.proposalTimeUNIX = toTimeUnix(proposalTimestamp);
    result.proposalTimestamp = proposalTimestamp;
  }
  if (exists(proposalHash)) result.proposalHash = proposalHash;
  if (exists(proposalLogIndex)) result.proposalLogIndex = proposalLogIndex;
  if (exists(requester)) result.requester = requester;
  if (exists(requestTimestamp)) result.requestTimestamp = requestTimestamp;
  if (exists(requestHash)) result.requestHash = requestHash;
  if (exists(requestLogIndex)) result.requestLogIndex = requestLogIndex;
  if (exists(disputeTimestamp)) {
    result.disputeTimeUTC = toTimeUTC(disputeTimestamp);
    result.disputeTimeUNIX = toTimeUnix(disputeTimestamp);
    result.disputeTimestamp = disputeTimestamp;
  }
  if (exists(disputeHash)) result.disputeHash = disputeHash;
  if (exists(disputeLogIndex)) result.disputeLogIndex = disputeLogIndex;
  if (exists(settlementTimestamp)) {
    result.settlementTimeUTC = toTimeUTC(settlementTimestamp);
    result.settlementTimeUNIX = toTimeUnix(settlementTimestamp);
    result.settlementTimestamp = settlementTimestamp;
  }
  if (exists(settlementHash)) result.settlementHash = settlementHash;
  if (exists(settlementLogIndex))
    result.settlementLogIndex = settlementLogIndex;
  result.approveBondSpendParams = makeApproveBondSpendParams({
    bond,
    tokenAddress: currency,
    oracleAddress,
    chainId,
  });
  if (result.actionType === "propose") {
    if (
      result.oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      result.proposePriceParams = makeProposePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      result.proposePriceParams = makeProposePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }
  if (result.actionType === "dispute") {
    if (
      result.oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      result.disputePriceParams = makeDisputePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      result.disputePriceParams = makeDisputePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }

  if (result.actionType === "settle") {
    if (
      oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      result.settlePriceParams = makeSettlePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      result.settlePriceParams = makeSettlePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }

  return result;
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
    assertionHash,
    assertionLogIndex,
    disputeTimestamp,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementHash,
    settlementLogIndex,
  } = assertion;
  const result: OracleQueryUI = {
    oracleType: "Optimistic Oracle V3",
    oracleAddress,
    chainId,
    id: assertionId,
    chainName: getChainName(chainId),
    project: "Unknown",
    expiryType: null,
    reward: null,
    actionType: getAssertionActionType(assertion),
    moreInformation: makeMoreInformationList(assertion),
  };
  if (exists(identifier)) {
    result.identifier = parseIdentifier(identifier);
  }

  if (exists(bond)) {
    result.bond = bond;
  }
  if (exists(expirationTime)) {
    result.livenessEndsMilliseconds = getLivenessEnds(expirationTime);
    result.formattedLivenessEndsIn = toTimeFormatted(expirationTime);
  }
  if (exists(settlementResolution)) {
    result.valueText = settlementResolution.toString();
  }
  if (exists(claim)) {
    result.queryTextHex = claim;
    result.queryText = safeDecodeHexString(claim);
    result.title = result.queryText;
    result.description = result.queryText;
    if (isOptimisticGovernor(result.queryText)) {
      result.project = "OSnap";
      const spaceName = extractSnapshotSpace(result.queryText);
      const explanationRegex = result.queryText.match(
        /explanation:"(.*?)",rules:/,
      );
      const rulesRegex = result.queryText.match(/rules:"(.*?)"/);
      let title = "OSnap Request";
      if (spaceName) {
        title = `OSnap Request - ${spaceName} `;
      }

      if (explanationRegex && explanationRegex[1]) {
        title = `${title}\n${explanationRegex[1]}`;
        if (rulesRegex && rulesRegex[1]) {
          result.description = `
*Explanation*
[${explanationRegex[1]}](https://ipfs.io/ipfs/${explanationRegex[1]})
*Rules*
${rulesRegex[1]}`;
        }
      }
      result.title = title;
    }
  }

  // handle Rated assertions
  if (result.identifier === "ROPU_ETHx") {
    result.project = "Rated";
    result.title = "Verify MEV violations in ETHx staking pool";
    result.queryText = result.queryTextHex
      ? BigInt(result.queryTextHex).toString()
      : undefined;
    result.description = `Report ID #${result.queryText} from the Rated smart contract contains all violations that happened during the period it covers.`;
    result.moreInformation.unshift({
      title: "UMIP",
      text: "UMIP-177",
      href: "https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-177.md",
    });
  }
  if (exists(currency)) {
    result.tokenAddress = currency;
  }

  result.approveBondSpendParams = makeApproveBondSpendParams({
    bond,
    tokenAddress: currency,
    oracleAddress,
    chainId,
  });
  result.disputeAssertionParams =
    result.actionType === "dispute"
      ? makeDisputeAssertionParams({
          assertionId,
          oracleAddress,
          chainId,
        })
      : undefined;

  result.settleAssertionParams =
    result.actionType === "settle"
      ? makeSettleAssertionParams({
          assertionId,
          oracleAddress,
          chainId,
        })
      : undefined;

  if (exists(assertionTimestamp)) {
    result.timeUTC = toTimeUTC(assertionTimestamp);
    result.timeUNIX = toTimeUnix(assertionTimestamp);
    result.timeMilliseconds = toTimeMilliseconds(assertionTimestamp);
    result.timeFormatted = toTimeFormatted(assertionTimestamp);
    result.assertionTimestamp = assertionTimestamp;
  }
  if (exists(assertionHash)) result.assertionHash = assertionHash;
  if (exists(assertionLogIndex)) result.assertionLogIndex = assertionLogIndex;
  if (exists(disputeTimestamp)) {
    result.disputeTimeUTC = toTimeUTC(disputeTimestamp);
    result.disputeTimeUNIX = toTimeUnix(disputeTimestamp);
    result.disputeTimestamp = disputeTimestamp;
  }
  if (exists(disputeHash)) result.disputeHash = disputeHash;
  if (exists(disputeLogIndex)) result.disputeLogIndex = disputeLogIndex;
  if (exists(settlementTimestamp)) {
    result.settlementTimeUTC = toTimeUTC(settlementTimestamp);
    result.settlementTimeUNIX = toTimeUnix(settlementTimestamp);
    result.settlementTimestamp = settlementTimestamp;
  }
  if (exists(settlementHash)) result.settlementHash = settlementHash;
  if (exists(settlementLogIndex))
    result.settlementLogIndex = settlementLogIndex;

  return result;
}

// input user values as regular numbers
export function decodeMultipleQueryPriceAtIndex(
  encodedPrice: bigint,
  index: number,
): number {
  if (index < 0 || index > 6) {
    throw new Error("Index out of range");
  }
  // Shift the bits of encodedPrice to the right by (32 * index) positions.
  // This operation effectively moves the desired 32-bit segment to the least significant position.
  // The bitwise AND operation with 0xffffffff ensures that only the least significant 32 bits are retained,
  // effectively extracting the 32-bit value at the specified index.
  return Number((encodedPrice >> BigInt(32 * index)) & BigInt(0xffffffff));
}
export function encodeMultipleQuery(values: string[]): string {
  if (values.length > 7) {
    throw new Error("Maximum of 7 values allowed");
  }

  let encodedPrice = BigInt(0);

  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === "") {
      throw new Error("All values must be defined");
    }
    const numValue = Number(values[i]);
    if (!Number.isInteger(numValue)) {
      throw new Error("All values must be integers");
    }
    if (numValue > 0xffffffff || numValue < 0) {
      throw new Error("Values must be uint32 (0 <= value <= 2^32 - 1)");
    }
    // Shift the current value to its correct position in the 256-bit field.
    // Each value is a 32-bit unsigned integer, so we shift it by 32 bits times its index.
    // This places the first value at the least significant bits and subsequent values
    // at increasingly higher bit positions.
    encodedPrice |= BigInt(numValue) << BigInt(32 * i);
  }

  return encodedPrice.toString();
}

export function decodeMultipleQuery(
  price: string,
  length: number,
): string[] | string {
  const result: number[] = [];
  const bigIntPrice = BigInt(price);

  if (isUnresolvable(price)) {
    return price;
  }

  for (let i = 0; i < length; i++) {
    const value = decodeMultipleQueryPriceAtIndex(bigIntPrice, i);
    result.push(value);
  }
  return result.map((x) => x.toString());
}
