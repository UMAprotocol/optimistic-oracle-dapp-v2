import type { ProviderConfig } from "@/constants";
import { config } from "@/constants";
import type {
  OOV1GraphEntity,
  OOV3GraphEntity,
  OracleType,
} from "@shared/types";
import { ethers } from "ethers";
import {
  contractInterface as ooV1Interface,
  getEventState as getOOV1EventState,
  requestId as ooV1RequestId,
  RequestState,
} from "@libs/clients/optimisticOracle";
import type { Request as OOV1Request } from "@libs/clients/optimisticOracle";
import { contractInterface as ooV2Interface } from "@libs/clients/optimisticOracleV2";
import {
  contractInterface as ooV3Interface,
  getEventState as getOOV3EventState,
} from "@libs/clients/optimisticOracleV3";
import type { Assertion as OOV3Assertion } from "@libs/clients/optimisticOracleV3";
import {
  contractInterface as skinnyInterface,
  getEventState as getSkinnyEventState,
} from "@libs/clients/skinnyOptimisticOracle";
import type { ScoredResult } from "./index";
import { scoreRequestEntity, scoreAssertionEntity, isV3 } from "./index";

function getInterfaceForOracleType(type: OracleType): ethers.utils.Interface {
  switch (type) {
    case "Optimistic Oracle V1":
      return ooV1Interface;
    case "Optimistic Oracle V2":
    case "Managed Optimistic Oracle V2":
      return ooV2Interface;
    case "Optimistic Oracle V3":
      return ooV3Interface;
    case "Skinny Optimistic Oracle":
      return skinnyInterface;
    default:
      return ooV1Interface;
  }
}

function convertRequestStateToString(
  state: RequestState | undefined,
): string | null {
  if (state === undefined) return null;
  if (state === RequestState.Requested) return "Requested";
  if (state === RequestState.Proposed) return "Proposed";
  if (state === RequestState.Expired) return "Expired";
  if (state === RequestState.Disputed) return "Disputed";
  if (state === RequestState.Resolved) return "Resolved";
  if (state === RequestState.Settled) return "Settled";
  return "Invalid";
}

function clientRequestToGraphEntity(request: OOV1Request): OOV1GraphEntity {
  return {
    id: ooV1RequestId(request),
    identifier: request.identifier,
    ancillaryData: request.ancillaryData,
    time: request.timestamp.toString(),
    requester: request.requester as `0x${string}`,
    currency: (request.currency ?? "") as `0x${string}`,
    reward: request.reward?.toString() ?? "0",
    finalFee: request.finalFee?.toString() ?? "0",
    proposer: request.proposer ?? null,
    proposedPrice: request.proposedPrice?.toString() ?? null,
    proposalExpirationTimestamp: request.expirationTime?.toString() ?? null,
    disputer: request.disputer ?? null,
    settlementPrice: request.price?.toString() ?? null,
    settlementPayout: request.payout?.toString() ?? null,
    settlementRecipient: null,
    state: convertRequestStateToString(request.state),
    requestTimestamp: null,
    requestBlockNumber: request.requestBlockNumber?.toString() ?? null,
    requestHash: request.requestTx ?? null,
    requestLogIndex: request.requestLogIndex?.toString() ?? null,
    proposalTimestamp: null,
    proposalBlockNumber: request.proposeBlockNumber?.toString() ?? null,
    proposalHash: request.proposeTx ?? null,
    proposalLogIndex: request.proposeLogIndex?.toString() ?? null,
    disputeTimestamp: null,
    disputeBlockNumber: request.disputeBlockNumber?.toString() ?? null,
    disputeHash: request.disputeTx ?? null,
    disputeLogIndex: request.disputeLogIndex?.toString() ?? null,
    settlementTimestamp: null,
    settlementBlockNumber: request.settleBlockNumber?.toString() ?? null,
    settlementHash: request.settleTx ?? null,
    settlementLogIndex: request.settleLogIndex?.toString() ?? null,
  };
}

function clientAssertionToGraphEntity(
  assertion: OOV3Assertion,
): OOV3GraphEntity {
  return {
    id: assertion.assertionId,
    assertionId: assertion.assertionId,
    domainId: assertion.domainId ?? "",
    claim: assertion.claim ?? "",
    asserter: assertion.asserter ?? "",
    identifier: assertion.identifier ?? "",
    callbackRecipient: assertion.callbackRecipient ?? "",
    escalationManager:
      assertion.escalationManagerSettings?.escalationManager ?? "",
    caller: assertion.assertionCaller ?? "",
    expirationTime: assertion.expirationTime?.toString() ?? "0",
    currency: (assertion.currency ?? "") as `0x${string}`,
    bond: assertion.bond?.toString() ?? "0",
    assertionTimestamp: assertion.assertionTime?.toString() ?? "",
    assertionBlockNumber: assertion.assertionBlockNumber?.toString() ?? "",
    assertionHash: assertion.assertionTx ?? "",
    assertionLogIndex: assertion.assertionLogIndex?.toString() ?? "",
    disputer: assertion.disputer ?? null,
    settlementPayout: null,
    settlementRecipient: null,
    settlementResolution: assertion.settlementResolution ?? null,
    disputeTimestamp: null,
    disputeBlockNumber: assertion.disputeBlockNumber?.toString() ?? null,
    disputeHash: assertion.disputeTx ?? null,
    disputeLogIndex: assertion.disputeLogIndex?.toString() ?? null,
    settlementTimestamp: null,
    settlementBlockNumber: assertion.settleBlockNumber?.toString() ?? null,
    settlementHash: assertion.settleTx ?? null,
    settlementLogIndex: assertion.settleLogIndex?.toString() ?? null,
  };
}

/**
 * Parses receipt logs for a given contract into event-like objects
 * suitable for the client getEventState() reducers.
 */
function parseReceiptLogs(
  receipt: ethers.providers.TransactionReceipt,
  contractAddress: string,
  iface: ethers.utils.Interface,
) {
  return receipt.logs
    .filter(
      (log) => log.address.toLowerCase() === contractAddress.toLowerCase(),
    )
    .map((log) => {
      try {
        const description = iface.parseLog(log);
        return {
          ...log,
          ...description,
          event: description.name,
          eventSignature: description.signature,
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        };
      } catch {
        return undefined;
      }
    })
    .filter(Boolean) as unknown[];
}

export async function searchByHashViaRpc(
  providerConfigs: ProviderConfig[],
  txHash: string,
  eventIndex: number | undefined,
): Promise<ScoredResult[]> {
  if (providerConfigs.length === 0) return [];

  // Group providers by chainId to avoid fetching the same receipt multiple times
  const byChain = new Map<number, ProviderConfig[]>();
  for (const pc of providerConfigs) {
    const list = byChain.get(pc.chainId) ?? [];
    list.push(pc);
    byChain.set(pc.chainId, list);
  }

  const results: ScoredResult[] = [];

  const promises = [...byChain.entries()].map(
    async ([chainId, chainConfigs]) => {
      const provider = new ethers.providers.JsonRpcProvider(
        chainConfigs[0].url,
      );

      let receipt: ethers.providers.TransactionReceipt;
      try {
        receipt = await provider.getTransactionReceipt(txHash);
      } catch {
        return;
      }
      if (!receipt) return;

      // Fetch block timestamp for populating timestamp fields that
      // events don't include but the subgraph does.
      let blockTimestamp: string | null = null;
      try {
        const block = await provider.getBlock(receipt.blockNumber);
        blockTimestamp = block.timestamp.toString();
      } catch {
        // Non-fatal — timestamps will be empty
      }

      for (const pc of chainConfigs) {
        try {
          const iface = getInterfaceForOracleType(pc.type);
          const parsedEvents = parseReceiptLogs(receipt, pc.address, iface);
          if (parsedEvents.length === 0) continue;

          const matchingSubgraph = config.subgraphs.find(
            (s) => s.chainId === chainId && s.type === pc.type,
          );
          if (!matchingSubgraph) continue;

          if (isV3(pc.type)) {
            const { assertions = {} } = getOOV3EventState(
              parsedEvents as Parameters<typeof getOOV3EventState>[0],
            );
            for (const assertion of Object.values(assertions)) {
              const entity = clientAssertionToGraphEntity(assertion);
              if (blockTimestamp) {
                if (entity.assertionBlockNumber && !entity.assertionTimestamp)
                  entity.assertionTimestamp = blockTimestamp;
                if (entity.disputeBlockNumber && !entity.disputeTimestamp)
                  entity.disputeTimestamp = blockTimestamp;
                if (entity.settlementBlockNumber && !entity.settlementTimestamp)
                  entity.settlementTimestamp = blockTimestamp;
              }
              const score = scoreAssertionEntity(entity, txHash, eventIndex);
              if (score > 0) {
                results.push({
                  type: "assertion",
                  entity,
                  config: matchingSubgraph,
                  score,
                });
              }
            }
          } else {
            // Skinny oracle events have a different arg structure (includes
            // a `request` struct), so use its dedicated reducer.
            const isSkinny = pc.type === "Skinny Optimistic Oracle";
            const { requests = {} } = isSkinny
              ? getSkinnyEventState(
                  parsedEvents as Parameters<typeof getSkinnyEventState>[0],
                )
              : getOOV1EventState(
                  parsedEvents as Parameters<typeof getOOV1EventState>[0],
                );
            for (const request of Object.values(requests)) {
              const entity = clientRequestToGraphEntity(request as OOV1Request);
              if (blockTimestamp) {
                if (entity.requestBlockNumber && !entity.requestTimestamp)
                  entity.requestTimestamp = blockTimestamp;
                if (entity.proposalBlockNumber && !entity.proposalTimestamp)
                  entity.proposalTimestamp = blockTimestamp;
                if (entity.disputeBlockNumber && !entity.disputeTimestamp)
                  entity.disputeTimestamp = blockTimestamp;
                if (entity.settlementBlockNumber && !entity.settlementTimestamp)
                  entity.settlementTimestamp = blockTimestamp;
              }
              const score = scoreRequestEntity(entity, txHash, eventIndex);
              if (score > 0) {
                results.push({
                  type: "request",
                  entity,
                  config: matchingSubgraph,
                  score,
                });
              }
            }
          }
        } catch {
          // Individual oracle type parsing failures are non-fatal
        }
      }
    },
  );

  await Promise.allSettled(promises);
  return results;
}
