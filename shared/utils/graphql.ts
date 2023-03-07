import type {
  ChainId,
  OOV2GraphEntity,
  OracleType,
  PriceRequestGraphEntity,
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

export function handleNullableGraphqlBigInt(bigInt: string | null) {
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
    time: BigNumber.from(priceRequest.time),
    requester: priceRequest.requester,
    currency: priceRequest.currency,
    reward: BigNumber.from(priceRequest.reward),
    finalFee: BigNumber.from(priceRequest.finalFee),
    // nullable values
    // present in both v1 and v2
    proposer: handleGraphqlNullableStringOrBytes(priceRequest.proposer),
    proposedPrice: handleNullableGraphqlBigInt(priceRequest.proposedPrice),
    proposalExpirationTimestamp: handleNullableGraphqlBigInt(
      priceRequest.proposalExpirationTimestamp
    ),
    disputer: handleGraphqlNullableStringOrBytes(priceRequest.disputer),
    settlementPrice: handleNullableGraphqlBigInt(priceRequest.settlementPrice),
    settlementPayout: handleNullableGraphqlBigInt(
      priceRequest.settlementPayout
    ),
    settlementRecipient: handleGraphqlNullableStringOrBytes(
      priceRequest.settlementRecipient
    ),
    state: handleGraphqlNullableStringOrBytes(priceRequest.state) ?? "Invalid",
    requestTimestamp: handleNullableGraphqlBigInt(
      priceRequest.requestTimestamp
    ),
    requestBlockNumber: handleNullableGraphqlBigInt(
      priceRequest.requestBlockNumber
    ),
    requestHash: handleGraphqlNullableStringOrBytes(priceRequest.requestHash),
    requestLogIndex: handleNullableGraphqlBigInt(priceRequest.requestLogIndex),
    proposalTimestamp: handleNullableGraphqlBigInt(
      priceRequest.proposalTimestamp
    ),
    proposalBlockNumber: handleNullableGraphqlBigInt(
      priceRequest.proposalBlockNumber
    ),
    proposalHash: handleGraphqlNullableStringOrBytes(priceRequest.proposalHash),
    proposalLogIndex: handleNullableGraphqlBigInt(
      priceRequest.proposalLogIndex
    ),
    disputeTimestamp: handleNullableGraphqlBigInt(
      priceRequest.disputeTimestamp
    ),
    disputeBlockNumber: handleNullableGraphqlBigInt(
      priceRequest.disputeBlockNumber
    ),
    disputeHash: handleGraphqlNullableStringOrBytes(priceRequest.disputeHash),
    disputeLogIndex: handleNullableGraphqlBigInt(priceRequest.disputeLogIndex),
    settlementTimestamp: handleNullableGraphqlBigInt(
      priceRequest.settlementTimestamp
    ),
    settlementBlockNumber: handleNullableGraphqlBigInt(
      priceRequest.settlementBlockNumber
    ),
    settlementHash: handleGraphqlNullableStringOrBytes(
      priceRequest.settlementHash
    ),
    settlementLogIndex: handleNullableGraphqlBigInt(
      priceRequest.settlementLogIndex
    ),
  };

  if (oracleType !== "Optimistic Oracle V2") {
    return withOOV1Keys;
  }

  const ooV2PriceRequest = priceRequest as OOV2GraphEntity;

  return {
    ...ooV2PriceRequest,
    customLiveness: handleNullableGraphqlBigInt(
      ooV2PriceRequest.customLiveness
    ),
    bond: handleNullableGraphqlBigInt(ooV2PriceRequest.bond),
    eventBased: handleGraphqlNullableBoolean(ooV2PriceRequest.eventBased),
  };
}
