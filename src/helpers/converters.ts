import { config } from "@/constants";
import type {
  ActionType,
  MoreInformationItem,
  OracleQueryUI,
  SolidityRequest,
} from "@/types";
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
import { BigNumber, ethers } from "ethers";
import { upperCase } from "lodash";
import type { Address } from "wagmi";
import { erc20ABI } from "wagmi";
import { formatBytes32String } from "./ethers";
import { getQueryMetaData } from "./queryParsing";

export type RequiredRequest = Omit<
  Request,
  "currency" | "bond" | "customLiveness"
> & {
  currency: Address;
  bond: BigNumber | null | undefined;
  customLiveness: BigNumber | null | undefined;
};
function canConvertToSolidityRequest(
  request: Request
): request is RequiredRequest {
  return Boolean(request.currency);
}
function convertToSolidityRequest(request: RequiredRequest): SolidityRequest {
  return {
    proposer: request.proposer || "0x0",
    disputer: request.disputer || "0x0",
    currency: request.currency,
    settled: request.settlementHash ? true : false,
    proposedPrice: request.proposedPrice
      ? request.proposedPrice
      : BigNumber.from(0),
    resolvedPrice: request.settlementPrice
      ? request.settlementPrice
      : BigNumber.from(0),
    expirationTime: request.proposalExpirationTimestamp
      ? BigNumber.from(request.proposalExpirationTimestamp)
      : BigNumber.from(0),
    reward: request.reward,
    finalFee: request.finalFee,
    bond: request.bond ? BigNumber.from(request.bond) : BigNumber.from(0),
    customLiveness: request.customLiveness
      ? BigNumber.from(request.customLiveness)
      : BigNumber.from(0),
  };
}

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
  if (toDate(expirationTime) < new Date()) {
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

function isOOV1PriceRequest(
  request: Request | Assertion
): request is ParsedOOV1GraphEntity {
  return request.oracleType === "Optimistic Oracle V1";
}

function isOOV2PriceRequest(
  request: Request | Assertion
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
  bond: BigNumber;
  tokenAddress: Address;
  oracleAddress: Address;
  chainId: ChainId;
}) {
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
  return (proposedPrice?: string) => {
    if (!proposedPrice) return;
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
        parseEther(proposedPrice),
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
  return (proposedPrice?: string) => {
    if (!proposedPrice) return;
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
        parseEther(proposedPrice),
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
}) {
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
  bytes32Identifier: string;
  time: string;
  ancillaryData: string;
  oracleAddress: Address;
  chainId: ChainId;
  request: SolidityRequest;
}) {
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

  const bond = isV2 && request.bond ? request.bond : request.finalFee;
  const customLiveness = isV2 ? request.customLiveness : null;
  const eventBased = isV2 ? request.eventBased : null;

  return { bond, customLiveness, eventBased };
}

function makeMoreInformationList(
  query: Request | Assertion,
  umipNumber?: string | undefined,
  umipUrl?: string | undefined
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
      }
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
          "address"
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
    moreInformation.push(
      {
        title: "Asserter",
        text: query.asserter,
        href: makeBlockExplorerLink(query.asserter, query.chainId, "address"),
      },
      {
        title: "Assertion Transaction",
        text: query.assertionHash,
        href: makeBlockExplorerLink(query.assertionHash, query.chainId, "tx"),
      },
      {
        title: "Caller",
        text: query.caller,
        href: makeBlockExplorerLink(query.caller, query.chainId, "address"),
      },
      {
        title: "Callback Recipient",
        text: query.callbackRecipient,
        href: makeBlockExplorerLink(
          query.callbackRecipient,
          query.chainId,
          "address"
        ),
      },
      {
        title: "Escalation Manager",
        text: query.escalationManager,
        href: makeBlockExplorerLink(
          query.escalationManager,
          query.chainId,
          "address"
        ),
      }
    );

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
          "address"
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
  const valueText = getPriceRequestValueText(proposedPrice, settlementPrice);
  const queryTextHex = ancillaryData;
  const queryText = safeDecodeHexString(ancillaryData);
  const { title, description, umipUrl, umipNumber, project } = getQueryMetaData(
    identifier,
    queryText
  );
  const { bond, eventBased } = getOOV2SpecificValues(request);
  const bytes32Identifier = formatBytes32String(identifier);
  const livenessEndsMilliseconds = getLivenessEnds(proposalExpirationTimestamp);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  const chainName = getChainName(chainId);
  const timeUTC = toTimeUTC(time);
  const timeUNIX = toTimeUnix(time);
  const timeMilliseconds = toTimeMilliseconds(time);
  const timeFormatted = toTimeFormatted(time);
  const expiryType = eventBased ? "Event-based" : "Time-based";
  const tokenAddress = currency;
  const moreInformation = makeMoreInformationList(request, umipNumber, umipUrl);
  const actionType = getRequestActionType(state);
  const approveBondSpendParams = makeApproveBondSpendParams({
    bond,
    tokenAddress,
    oracleAddress,
    chainId,
  });
  let proposePriceParams: OracleQueryUI["proposePriceParams"] = undefined;
  if (actionType === "propose") {
    if (
      oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      proposePriceParams = makeProposePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      proposePriceParams = makeProposePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }
  let disputePriceParams: OracleQueryUI["disputePriceParams"] = undefined;
  if (actionType === "dispute") {
    if (
      oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      disputePriceParams = makeDisputePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      disputePriceParams = makeDisputePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }

  let settlePriceParams: OracleQueryUI["settlePriceParams"] = undefined;
  if (actionType === "settle") {
    if (
      oracleType === "Skinny Optimistic Oracle" &&
      canConvertToSolidityRequest(request)
    ) {
      settlePriceParams = makeSettlePriceSkinnyParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
        request: convertToSolidityRequest(request),
      });
    } else {
      settlePriceParams = makeSettlePriceParams({
        requester,
        bytes32Identifier,
        time,
        ancillaryData,
        oracleAddress,
        chainId,
      });
    }
  }

  const disputeAssertionParams = undefined;
  const settleAssertionParams = undefined;

  return {
    project,
    title,
    description,
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
    moreInformation,
    actionType,
    approveBondSpendParams,
    proposePriceParams,
    disputePriceParams,
    settlePriceParams,
    disputeAssertionParams,
    settleAssertionParams,
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
    state,
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
    assertionHash,
    assertionLogIndex,
    disputeTimestamp,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementHash,
    settlementLogIndex,
  } = assertion;
  const oracleType = "Optimistic Oracle V3";
  const id = assertionId;
  const livenessEndsMilliseconds = getLivenessEnds(expirationTime);
  const formattedLivenessEndsIn = toTimeFormatted(livenessEndsMilliseconds);
  const chainName = getChainName(chainId);
  const timeUTC = toTimeUTC(assertionTimestamp);
  const timeUNIX = toTimeUnix(assertionTimestamp);
  const timeMilliseconds = toTimeMilliseconds(assertionTimestamp);
  const timeFormatted = toTimeFormatted(assertionTimestamp);
  const valueText = settlementResolution.toString();
  const queryTextHex = claim;
  const queryText = safeDecodeHexString(claim);
  const title = queryText;
  const description = queryText;
  const project = "UMA";
  const expiryType = null;
  const tokenAddress = currency;
  // no reward is present on assertions
  const reward = null;
  const moreInformation = makeMoreInformationList(assertion);
  const actionType = getAssertionActionType(assertion);
  const approveBondSpendParams = makeApproveBondSpendParams({
    bond,
    tokenAddress,
    oracleAddress,
    chainId,
  });
  const disputeAssertionParams =
    actionType === "dispute"
      ? makeDisputeAssertionParams({
          assertionId,
          oracleAddress,
          chainId,
        })
      : undefined;

  const settleAssertionParams =
    actionType === "settle"
      ? makeSettleAssertionParams({
          assertionId,
          oracleAddress,
          chainId,
        })
      : undefined;

  const proposePriceParams = undefined;
  const disputePriceParams = undefined;
  const settlePriceParams = undefined;

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
    description,
    moreInformation,
    reward,
    bond,
    approveBondSpendParams,
    disputeAssertionParams,
    proposePriceParams,
    disputePriceParams,
    settlePriceParams,
    settleAssertionParams,
    // searchable properties
    assertionTimestamp,
    assertionHash,
    assertionLogIndex,
    disputeTimestamp,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementHash,
    settlementLogIndex,
  };
}
