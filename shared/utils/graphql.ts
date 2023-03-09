import type {
  AssertionGraphEntity,
  ChainId,
  ChainName,
  OOV2GraphEntity,
  OracleType,
  PriceRequestGraphEntity,
  RequestState,
} from "@shared/types";
import { BigNumber } from "ethers";

export function handleGraphqlNullableStringOrBytes(
  stringOrBytes: string | null
) {
  if (stringOrBytes === null) {
    return undefined;
  }
  return stringOrBytes;
}

export function handleGraphqlNullableBigInt(bigInt: string | null) {
  if (bigInt === null) {
    return undefined;
  }
  return BigNumber.from(bigInt);
}

export function handleGraphqlNullableBoolean(boolean: boolean | null) {
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
  const withOOV1Keys = {
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

  if (oracleType !== "Optimistic Oracle V2") {
    return withOOV1Keys;
  }

  const ooV2PriceRequest = priceRequest as OOV2GraphEntity;

  // nullable values
  // only present in v2
  return {
    ...ooV2PriceRequest,
    ...withOOV1Keys,
    customLiveness: handleGraphqlNullableStringOrBytes(
      ooV2PriceRequest.customLiveness
    ),
    bond: handleGraphqlNullableBigInt(ooV2PriceRequest.bond),
    eventBased: handleGraphqlNullableBoolean(ooV2PriceRequest.eventBased),
  };
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
    bond,
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
