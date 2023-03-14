import type {
  AssertionGraphEntity,
  ChainId,
  ChainName,
  OOV2GraphEntity,
  OracleType,
  ParsedOOV1GraphEntity,
  ParsedOOV2GraphEntity,
  PriceRequestGraphEntity,
  RequestState,
} from "@shared/types";
import { BigNumber } from "ethers";

export function handleGraphqlNullableStringOrBytes(
  stringOrBytes: string | null
) {
  if (!(typeof stringOrBytes === "string" || Object.is(stringOrBytes, null))) {
    throw new Error(
      `Expected string or null, got ${typeof stringOrBytes} instead`
    );
  }
  if (stringOrBytes === null) {
    return undefined;
  }
  return stringOrBytes;
}

export function handleGraphqlNullableBigInt(bigInt: string | null) {
  if (!(typeof bigInt === "string" || Object.is(bigInt, null))) {
    throw new Error(`Expected string or null, got ${typeof bigInt} instead`);
  }
  if (bigInt === null) {
    return undefined;
  }
  return BigNumber.from(bigInt);
}

export function handleGraphqlNullableBoolean(boolean: boolean | null) {
  if (!(typeof boolean === "boolean" || Object.is(boolean, null))) {
    throw new Error(`Expected boolean or null, got ${typeof boolean} instead`);
  }
  if (boolean === null) {
    return undefined;
  }
  return boolean;
}

export function makeQueryName(oracleType: OracleType, chainName: ChainName) {
  const camelCaseOracleType = oracleType.replaceAll(" ", "");
  const camelCaseChainName = chainName.replaceAll(" ", "");
  return `${camelCaseOracleType}${camelCaseChainName}`;
}

export function parsePriceRequestGraphEntity(
  priceRequest: PriceRequestGraphEntity,
  chainId: ChainId,
  oracleAddress: string,
  oracleType: OracleType
) {
  const parsed: ParsedOOV1GraphEntity | ParsedOOV2GraphEntity = {
    chainId,
    oracleAddress,
    oracleType,
    // non-nullable values
    // present in both v1 and v2
    id: priceRequest.id,
    identifier: priceRequest.identifier,
    ancillaryData: priceRequest.ancillaryData,
    time: priceRequest.time,
    requester: priceRequest.requester,
    currency: priceRequest.currency,
    reward: BigNumber.from(priceRequest.reward),
    finalFee: BigNumber.from(priceRequest.finalFee),
    // nullable values
    // present in both v1 and v2
    proposer: handleGraphqlNullableStringOrBytes(priceRequest.proposer),
    proposedPrice: handleGraphqlNullableBigInt(priceRequest.proposedPrice),
    proposalExpirationTimestamp: handleGraphqlNullableStringOrBytes(
      priceRequest.proposalExpirationTimestamp
    ),
    disputer: handleGraphqlNullableStringOrBytes(priceRequest.disputer),
    settlementPrice: handleGraphqlNullableBigInt(priceRequest.settlementPrice),
    settlementPayout: handleGraphqlNullableBigInt(
      priceRequest.settlementPayout
    ),
    settlementRecipient: handleGraphqlNullableStringOrBytes(
      priceRequest.settlementRecipient
    ),
    state:
      (handleGraphqlNullableStringOrBytes(
        priceRequest.state
      ) as RequestState) ?? "Invalid",
    requestTimestamp: handleGraphqlNullableStringOrBytes(
      priceRequest.requestTimestamp
    ),
    requestBlockNumber: handleGraphqlNullableBigInt(
      priceRequest.requestBlockNumber
    ),
    requestHash: handleGraphqlNullableStringOrBytes(priceRequest.requestHash),
    requestLogIndex: handleGraphqlNullableBigInt(priceRequest.requestLogIndex),
    proposalTimestamp: handleGraphqlNullableStringOrBytes(
      priceRequest.proposalTimestamp
    ),
    proposalBlockNumber: handleGraphqlNullableBigInt(
      priceRequest.proposalBlockNumber
    ),
    proposalHash: handleGraphqlNullableStringOrBytes(priceRequest.proposalHash),
    proposalLogIndex: handleGraphqlNullableBigInt(
      priceRequest.proposalLogIndex
    ),
    disputeTimestamp: handleGraphqlNullableStringOrBytes(
      priceRequest.disputeTimestamp
    ),
    disputeBlockNumber: handleGraphqlNullableBigInt(
      priceRequest.disputeBlockNumber
    ),
    disputeHash: handleGraphqlNullableStringOrBytes(priceRequest.disputeHash),
    disputeLogIndex: handleGraphqlNullableBigInt(priceRequest.disputeLogIndex),
    settlementTimestamp: handleGraphqlNullableStringOrBytes(
      priceRequest.settlementTimestamp
    ),
    settlementBlockNumber: handleGraphqlNullableBigInt(
      priceRequest.settlementBlockNumber
    ),
    settlementHash: handleGraphqlNullableStringOrBytes(
      priceRequest.settlementHash
    ),
    settlementLogIndex: handleGraphqlNullableBigInt(
      priceRequest.settlementLogIndex
    ),
  };

  if (isOOV2GraphEntity(priceRequest)) {
    const parsedAsOOV2 = parsed as ParsedOOV2GraphEntity;
    parsedAsOOV2.customLiveness = handleGraphqlNullableStringOrBytes(
      priceRequest.customLiveness
    );
    parsedAsOOV2.bond = handleGraphqlNullableBigInt(priceRequest.bond);
    parsedAsOOV2.eventBased = handleGraphqlNullableBoolean(
      priceRequest.eventBased
    );

    return parsedAsOOV2;
  }

  return parsed;
}

export function parseAssertionGraphEntity(
  assertion: AssertionGraphEntity,
  chainId: ChainId,
  oracleAddress: string
) {
  const {
    id,
    assertionId,
    domainId,
    claim,
    asserter,
    identifier,
    callbackRecipient,
    escalationManager,
    caller,
    expirationTime,
    currency,
    bond,
    disputer,
    settlementPayout,
    settlementRecipient,
    settlementResolution,
    assertionTimestamp,
    assertionBlockNumber,
    assertionHash,
    assertionLogIndex,
    disputeTimestamp,
    disputeBlockNumber,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementBlockNumber,
    settlementHash,
    settlementLogIndex,
  } = assertion;
  return {
    chainId,
    oracleAddress,
    id,
    assertionId,
    domainId,
    claim,
    asserter,
    identifier,
    callbackRecipient,
    escalationManager,
    caller,
    expirationTime,
    currency,
    bond: BigNumber.from(bond),
    assertionTimestamp: assertionTimestamp,
    assertionBlockNumber: assertionBlockNumber,
    assertionHash: assertionHash,
    assertionLogIndex: assertionLogIndex,
    disputer: handleGraphqlNullableStringOrBytes(disputer),
    settlementPayout: handleGraphqlNullableBigInt(settlementPayout),
    settlementRecipient:
      handleGraphqlNullableStringOrBytes(settlementRecipient),
    settlementResolution:
      handleGraphqlNullableStringOrBytes(settlementResolution),
    disputeTimestamp: handleGraphqlNullableStringOrBytes(disputeTimestamp),
    disputeBlockNumber: handleGraphqlNullableBigInt(disputeBlockNumber),
    disputeHash: handleGraphqlNullableStringOrBytes(disputeHash),
    disputeLogIndex: handleGraphqlNullableBigInt(disputeLogIndex),
    settlementTimestamp:
      handleGraphqlNullableStringOrBytes(settlementTimestamp),
    settlementBlockNumber: handleGraphqlNullableBigInt(settlementBlockNumber),
    settlementHash: handleGraphqlNullableStringOrBytes(settlementHash),
    settlementLogIndex: handleGraphqlNullableBigInt(settlementLogIndex),
  };
}

function isOOV2GraphEntity(
  request: PriceRequestGraphEntity
): request is OOV2GraphEntity {
  return (
    "customLiveness" in request || "bond" in request || "eventBased" in request
  );
}
