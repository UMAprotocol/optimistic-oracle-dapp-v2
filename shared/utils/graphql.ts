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

export function handleGraphqlNullableStringOrBytes<
  EntityKey extends { [key: string]: string | null }
>(entityKey: EntityKey | null) {
  if (entityKey === null) return null;

  const [property, stringOrBytes] = Object.entries(entityKey)[0];

  if (!(typeof stringOrBytes === "string" || stringOrBytes === null)) {
    console.error(
      `Wrong type in \`handleGraphqlNullableStringOrBytes\`: Expected string or null for ${property}, got ${typeof stringOrBytes} instead`
    );
  }
  if (stringOrBytes === null) return null;

  return stringOrBytes;
}

export function handleGraphqlNullableBigInt<
  EntityKey extends { [key: string]: string | null }
>(entityKey: EntityKey | null) {
  if (entityKey === null) return null;

  const [property, bigInt] = Object.entries(entityKey)[0];

  if (!(typeof bigInt === "string" || bigInt === null)) {
    console.error(
      `Wrong type in \`handleGraphqlNullableBigInt\`: Expected string or null for ${property}, got ${typeof bigInt} instead`
    );
  }
  if (bigInt === null) return null;

  return BigNumber.from(bigInt);
}

export function handleGraphqlNullableBoolean<
  EntityKey extends { [key: string]: boolean | null }
>(entityKey: EntityKey | null) {
  if (entityKey === null) return null;

  const [property, boolean] = Object.entries(entityKey)[0];

  if (!(typeof boolean === "boolean" || boolean === null)) {
    console.error(
      `Wrong type in \`handleGraphqlNullableBoolean\`: Expected boolean or null for ${property}, got ${typeof boolean} instead`
    );
  }

  if (boolean === null) return null;

  return boolean;
}

export function makeQueryName(oracleType: OracleType, chainName: ChainName) {
  const camelCaseOracleType = oracleType.replaceAll(" ", "");
  const camelCaseChainName = chainName.replaceAll(" ", "");
  return `${camelCaseOracleType}${camelCaseChainName}`;
}

/**
 * Takes a price request entity from the graph and parses it into a more usable format
 * Warns if there are fields that have types we do not expect, since the graph schema is not
 * linked to this codebase
 * Handles OOV1, OOV2, and Skinny OO entities
 */
export function parsePriceRequestGraphEntity(
  priceRequest: PriceRequestGraphEntity,
  chainId: ChainId,
  oracleAddress: `0x${string}`,
  oracleType: OracleType
) {
  const {
    proposer,
    id,
    identifier,
    ancillaryData,
    time,
    requester,
    currency,
    reward,
    finalFee,
    proposedPrice,
    proposalExpirationTimestamp,
    disputer,
    settlementPrice,
    settlementPayout,
    settlementRecipient,
    state,
    requestTimestamp,
    requestBlockNumber,
    requestHash,
    requestLogIndex,
    proposalTimestamp,
    proposalBlockNumber,
    proposalHash,
    proposalLogIndex,
    disputeTimestamp,
    disputeBlockNumber,
    disputeHash,
    disputeLogIndex,
    settlementTimestamp,
    settlementBlockNumber,
    settlementHash,
    settlementLogIndex,
  } = priceRequest;
  const parsed: ParsedOOV1GraphEntity | ParsedOOV2GraphEntity = {
    chainId,
    oracleAddress,
    oracleType,
    // non-nullable values
    // present in both v1 and v2
    id,
    identifier,
    ancillaryData,
    time,
    requester,
    currency,
    reward: BigNumber.from(reward),
    finalFee: BigNumber.from(finalFee),
    // nullable values
    // present in both v1 and v2
    proposer: handleGraphqlNullableStringOrBytes({ proposer }),
    proposedPrice: handleGraphqlNullableBigInt({ proposedPrice }),
    proposalExpirationTimestamp: handleGraphqlNullableStringOrBytes({
      proposalExpirationTimestamp,
    }),
    disputer: handleGraphqlNullableStringOrBytes({ disputer }),
    settlementPrice: handleGraphqlNullableBigInt({ settlementPrice }),
    settlementPayout: handleGraphqlNullableBigInt({ settlementPayout }),
    settlementRecipient: handleGraphqlNullableStringOrBytes({
      settlementRecipient,
    }),
    state:
      (handleGraphqlNullableStringOrBytes({ state }) as RequestState) ??
      "Invalid",
    requestTimestamp: handleGraphqlNullableStringOrBytes({ requestTimestamp }),
    requestBlockNumber: handleGraphqlNullableBigInt({ requestBlockNumber }),
    requestHash: handleGraphqlNullableStringOrBytes({ requestHash }),
    requestLogIndex: handleGraphqlNullableBigInt({ requestLogIndex }),
    proposalTimestamp: handleGraphqlNullableStringOrBytes({
      proposalTimestamp,
    }),
    proposalBlockNumber: handleGraphqlNullableBigInt({ proposalBlockNumber }),
    proposalHash: handleGraphqlNullableStringOrBytes({ proposalHash }),
    proposalLogIndex: handleGraphqlNullableBigInt({ proposalLogIndex }),
    disputeTimestamp: handleGraphqlNullableStringOrBytes({ disputeTimestamp }),
    disputeBlockNumber: handleGraphqlNullableBigInt({ disputeBlockNumber }),
    disputeHash: handleGraphqlNullableStringOrBytes({ disputeHash }),
    disputeLogIndex: handleGraphqlNullableBigInt({ disputeLogIndex }),
    settlementTimestamp: handleGraphqlNullableStringOrBytes({
      settlementTimestamp,
    }),
    settlementBlockNumber: handleGraphqlNullableBigInt({
      settlementBlockNumber,
    }),
    settlementHash: handleGraphqlNullableStringOrBytes({ settlementHash }),
    settlementLogIndex: handleGraphqlNullableBigInt({ settlementLogIndex }),
  };

  if (isOOV2GraphEntity(priceRequest)) {
    const parsedAsOOV2 = parsed as ParsedOOV2GraphEntity;
    const customLiveness = priceRequest.customLiveness ?? null;
    const bond = priceRequest.bond ?? null;
    priceRequest.eventBased ?? null;
    const eventBased = priceRequest.eventBased ?? null;

    parsedAsOOV2.customLiveness = handleGraphqlNullableStringOrBytes({
      customLiveness,
    });
    parsedAsOOV2.bond = handleGraphqlNullableBigInt({ bond });
    parsedAsOOV2.eventBased = handleGraphqlNullableBoolean({ eventBased });

    return parsedAsOOV2;
  }

  return parsed;
}

/**
 * Takes a price request entity from the graph and parses it into a more usable format
 * Warns if there are fields that have types we do not expect, since the graph schema is not
 * linked to this codebase
 * Handles OOV3 entities
 */
export function parseAssertionGraphEntity(
  assertion: AssertionGraphEntity,
  chainId: ChainId,
  oracleAddress: `0x${string}`
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
    disputer: handleGraphqlNullableStringOrBytes({ disputer }),
    settlementPayout: handleGraphqlNullableBigInt({ settlementPayout }),
    settlementRecipient: handleGraphqlNullableStringOrBytes({
      settlementRecipient,
    }),
    settlementResolution: handleGraphqlNullableStringOrBytes({
      settlementResolution,
    }),
    disputeTimestamp: handleGraphqlNullableStringOrBytes({ disputeTimestamp }),
    disputeBlockNumber: handleGraphqlNullableBigInt({ disputeBlockNumber }),
    disputeHash: handleGraphqlNullableStringOrBytes({ disputeHash }),
    disputeLogIndex: handleGraphqlNullableBigInt({ disputeLogIndex }),
    settlementTimestamp: handleGraphqlNullableStringOrBytes({
      settlementTimestamp,
    }),
    settlementBlockNumber: handleGraphqlNullableBigInt({
      settlementBlockNumber,
    }),
    settlementHash: handleGraphqlNullableStringOrBytes({ settlementHash }),
    settlementLogIndex: handleGraphqlNullableBigInt({ settlementLogIndex }),
  };
}

function isOOV2GraphEntity(
  request: PriceRequestGraphEntity
): request is OOV2GraphEntity {
  return (
    "customLiveness" in request || "bond" in request || "eventBased" in request
  );
}
