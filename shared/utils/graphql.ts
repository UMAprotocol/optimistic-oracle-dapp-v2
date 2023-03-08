import type {
  AssertionGraphEntity,
  ChainId,
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

export function makeQueryName(oracleType: OracleType, chainId: number) {
  const camelCaseOracleType = oracleType.replaceAll(" ", "");
  return `${camelCaseOracleType}Chain${chainId}`;
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
  return {
    chainId,
    oracleType: "Optimistic Oracle V3",
    oracleAddress,
    id: assertion.id,
    assertionId: assertion.assertionId,
    domainId: assertion.domainId,
    claim: assertion.claim,
    asserter: assertion.asserter,
    identifier: assertion.identifier,
    callbackRecipient: assertion.callbackRecipient,
    escalationManager: assertion.escalationManager,
    caller: assertion.caller,
    expirationTime: assertion.expirationTime,
    currency: assertion.currency,
    bond: assertion.bond,
    disputer: handleGraphqlNullableStringOrBytes(assertion.disputer),
    settlementPayout: handleGraphqlNullableBigInt(assertion.settlementPayout),
    settlementRecipient: handleGraphqlNullableStringOrBytes(
      assertion.settlementRecipient
    ),
    settlementResolution: handleGraphqlNullableStringOrBytes(
      assertion.settlementResolution
    ),
    assertionTimestamp: handleGraphqlNullableStringOrBytes(
      assertion.assertionTimestamp
    ),
    assertionBlockNumber: handleGraphqlNullableBigInt(
      assertion.assertionBlockNumber
    ),
    assertionHash: handleGraphqlNullableStringOrBytes(assertion.assertionHash),
    assertionLogIndex: handleGraphqlNullableBigInt(assertion.assertionLogIndex),
    disputeTimestamp: handleGraphqlNullableStringOrBytes(
      assertion.disputeTimestamp
    ),
    disputeBlockNumber: handleGraphqlNullableBigInt(
      assertion.disputeBlockNumber
    ),
    disputeHash: handleGraphqlNullableStringOrBytes(assertion.disputeHash),
    disputeLogIndex: handleGraphqlNullableBigInt(assertion.disputeLogIndex),
    settlementTimestamp: handleGraphqlNullableStringOrBytes(
      assertion.settlementTimestamp
    ),
    settlementBlockNumber: handleGraphqlNullableBigInt(
      assertion.settlementBlockNumber
    ),
    settlementHash: handleGraphqlNullableStringOrBytes(
      assertion.settlementHash
    ),
    settlementLogIndex: handleGraphqlNullableBigInt(
      assertion.settlementLogIndex
    ),
  };
}
