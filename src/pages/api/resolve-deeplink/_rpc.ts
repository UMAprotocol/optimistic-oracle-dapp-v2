import type { ProviderConfig } from "@/constants";
import { config } from "@/constants";
import type {
  OOV1GraphEntity,
  OOV2GraphEntity,
  OOV3GraphEntity,
  OracleType,
} from "@shared/types";
import { ethers } from "ethers";
import { parseIdentifier } from "@libs/utils";
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
function parseLogs(
  logs: ethers.providers.Log[],
  contractAddress: string,
  iface: ethers.utils.Interface,
) {
  return logs
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
        };
      } catch {
        return undefined;
      }
    })
    .filter(Boolean) as unknown[];
}

function parseReceiptLogs(
  receipt: ethers.providers.TransactionReceipt,
  contractAddress: string,
  iface: ethers.utils.Interface,
) {
  return parseLogs(receipt.logs, contractAddress, iface);
}

// --- Live on-chain state ---
//
// A receipt only contains the events of the linked transaction, so a link to a
// request tx would otherwise look "Requested" forever. These helpers read the
// current state from the contract so RPC-resolved links land on the right page
// and show the right actions even when no subgraph is available.

const GET_STATE =
  "function getState(address requester, bytes32 identifier, uint256 timestamp, bytes ancillaryData) view returns (uint8)";
const GET_REQUEST =
  "function getRequest(address requester, bytes32 identifier, uint256 timestamp, bytes ancillaryData) view returns ";
const REQUEST_SETTINGS =
  "tuple(bool eventBased, bool refundOnDispute, bool callbackOnPriceProposed, bool callbackOnPriceDisputed, bool callbackOnPriceSettled, uint256 bond, uint256 customLiveness) requestSettings";
const OOV2_REQUEST_FIELDS = `address proposer, address disputer, address currency, bool settled, ${REQUEST_SETTINGS}, int256 proposedPrice, int256 resolvedPrice, uint256 expirationTime, uint256 reward, uint256 finalFee`;

// The Request struct differs per oracle (Managed appends proposalTime), so
// each type needs its own ABI to decode getRequest correctly.
const LIVE_REQUEST_ABIS: Partial<Record<OracleType, string[]>> = {
  "Optimistic Oracle V1": [
    GET_STATE,
    GET_REQUEST +
      "(tuple(address proposer, address disputer, address currency, bool settled, bool refundOnDispute, int256 proposedPrice, int256 resolvedPrice, uint256 expirationTime, uint256 reward, uint256 finalFee, uint256 bond, uint256 customLiveness))",
  ],
  "Optimistic Oracle V2": [
    GET_STATE,
    GET_REQUEST + `(tuple(${OOV2_REQUEST_FIELDS}))`,
  ],
  "Managed Optimistic Oracle V2": [
    GET_STATE,
    GET_REQUEST + `(tuple(${OOV2_REQUEST_FIELDS}, uint256 proposalTime))`,
  ],
};

// Decoded getRequest result. requestSettings exists on OOv2/Managed only.
type LiveRequest = {
  proposer: string;
  disputer: string;
  currency: string;
  settled: boolean;
  proposedPrice: ethers.BigNumber;
  resolvedPrice: ethers.BigNumber;
  expirationTime: ethers.BigNumber;
  reward: ethers.BigNumber;
  finalFee: ethers.BigNumber;
  requestSettings?: {
    eventBased: boolean;
    bond: ethers.BigNumber;
    customLiveness: ethers.BigNumber;
  };
};

// OOv2 and Managed subgraphs build request ids as
// identifier-timestamp-keccak256(ancillaryData); OOv1 and Skinny use the raw
// ancillary data.
const HASHED_ID_TYPES: OracleType[] = [
  "Optimistic Oracle V2",
  "Managed Optimistic Oracle V2",
];

function nonZeroAddress(address: string): string | null {
  return address === ethers.constants.AddressZero ? null : address;
}

async function applyLiveRequestState(
  provider: ethers.providers.Provider,
  address: string,
  type: OracleType,
  request: OOV1Request,
  entity: OOV1GraphEntity,
): Promise<OOV1GraphEntity | OOV2GraphEntity> {
  const abi = LIVE_REQUEST_ABIS[type];
  if (!abi) return entity;
  const contract = new ethers.Contract(address, abi, provider);
  const args = [
    request.requester,
    request.identifier,
    request.timestamp,
    request.ancillaryData,
  ];
  const getRequest = contract.getRequest as (
    ...a: unknown[]
  ) => Promise<LiveRequest>;
  const getState = contract.getState as (...a: unknown[]) => Promise<number>;
  const [onchain, state] = await Promise.all([
    getRequest(...args),
    getState(...args),
  ]);

  const proposer = nonZeroAddress(onchain.proposer);
  // The contract zeroes reward on refund-on-dispute, so prefer the values the
  // RequestPrice event recorded (what the subgraph shows) when we have them.
  const hasRequestEvent = entity.requestHash !== null;
  const live: OOV1GraphEntity = {
    ...entity,
    // OOv2-family subgraphs key requests by the ancillary data hash.
    id: HASHED_ID_TYPES.includes(type)
      ? [
          parseIdentifier(request.identifier),
          request.timestamp.toString(),
          ethers.utils.keccak256(request.ancillaryData),
        ].join("-")
      : entity.id,
    state: convertRequestStateToString(state as RequestState),
    proposer: proposer,
    disputer: nonZeroAddress(onchain.disputer),
    currency: onchain.currency as OOV1GraphEntity["currency"],
    reward: hasRequestEvent ? entity.reward : onchain.reward.toString(),
    finalFee: hasRequestEvent ? entity.finalFee : onchain.finalFee.toString(),
    proposedPrice: proposer ? onchain.proposedPrice.toString() : null,
    proposalExpirationTimestamp: onchain.expirationTime.isZero()
      ? null
      : onchain.expirationTime.toString(),
    settlementPrice: onchain.settled
      ? onchain.resolvedPrice.toString()
      : entity.settlementPrice,
  };

  const settings = onchain.requestSettings;
  if (!settings) return live;
  return {
    ...live,
    bond: settings.bond.toString(),
    customLiveness: settings.customLiveness.toString(),
    eventBased: settings.eventBased,
  };
}

/**
 * Every OOv3 event indexes assertionId, so a single topic-filtered getLogs
 * returns the assertion's whole lifecycle (made, disputed, settled) with
 * hashes. Returns undefined if the RPC rejects the query, so callers can fall
 * back to the receipt-only view.
 *
 * Some RPCs (e.g. Infura) cap getLogs at a 10k-block range. For those we scan
 * forward from the linked tx in capped windows until the settlement shows up.
 */
const LOG_RANGE_CAP = 10_000;
const MAX_RANGE_WINDOWS = 30;
const WINDOW_CONCURRENCY = 5;

async function getAssertionHistory(
  provider: ethers.providers.Provider,
  address: string,
  assertionId: string,
  fromBlock: number,
) {
  const topics = [null as unknown as string, assertionId];
  try {
    const logs = await provider.getLogs({
      address,
      topics,
      fromBlock: 0,
      toBlock: "latest",
    });
    return parseLogs(logs, address, ooV3Interface);
  } catch {
    // Fall through to windowed scan
  }

  try {
    const head = await provider.getBlockNumber();
    const windows: [number, number][] = [];
    for (
      let start = fromBlock;
      start <= head && windows.length < MAX_RANGE_WINDOWS;
      start += LOG_RANGE_CAP
    ) {
      windows.push([start, Math.min(start + LOG_RANGE_CAP - 1, head)]);
    }
    const settledTopic = ooV3Interface.getEventTopic("AssertionSettled");
    const logs: ethers.providers.Log[] = [];
    for (let i = 0; i < windows.length; i += WINDOW_CONCURRENCY) {
      const batch = await Promise.all(
        windows
          .slice(i, i + WINDOW_CONCURRENCY)
          .map(([from, to]) =>
            provider.getLogs({ address, topics, fromBlock: from, toBlock: to }),
          ),
      );
      logs.push(...batch.flat());
      if (logs.some((log) => log.topics[0] === settledTopic)) break;
    }
    return parseLogs(logs, address, ooV3Interface);
  } catch {
    return undefined;
  }
}

async function getBlockTimestamps(
  provider: ethers.providers.Provider,
  blockNumbers: (string | null | undefined)[],
) {
  const unique = [
    ...new Set(blockNumbers.filter((n): n is string => Boolean(n))),
  ];
  const entries = await Promise.all(
    unique.map(async (n) => {
      try {
        const block = await provider.getBlock(Number(n));
        return [n, block.timestamp.toString()] as const;
      } catch {
        return [n, null] as const;
      }
    }),
  );
  return new Map(entries);
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
            for (const receiptAssertion of Object.values(assertions)) {
              // Prefer the full lifecycle so later disputes/settlements show up.
              const history = await getAssertionHistory(
                provider,
                pc.address,
                receiptAssertion.assertionId,
                receipt.blockNumber,
              );
              const fullAssertion = history?.length
                ? Object.values(
                    getOOV3EventState(
                      history as Parameters<typeof getOOV3EventState>[0],
                    ).assertions ?? {},
                  ).find((a) => a.assertionId === receiptAssertion.assertionId)
                : undefined;
              const entity = clientAssertionToGraphEntity(
                fullAssertion ?? receiptAssertion,
              );
              const timestamps = fullAssertion
                ? await getBlockTimestamps(provider, [
                    entity.assertionBlockNumber,
                    entity.disputeBlockNumber,
                    entity.settlementBlockNumber,
                  ])
                : undefined;
              const timestampFor = (block: string | null) => {
                if (!timestamps) return blockTimestamp;
                return (block ? timestamps.get(block) : null) ?? null;
              };
              if (entity.assertionBlockNumber && !entity.assertionTimestamp)
                entity.assertionTimestamp =
                  timestampFor(entity.assertionBlockNumber) ?? "";
              if (entity.disputeBlockNumber && !entity.disputeTimestamp)
                entity.disputeTimestamp = timestampFor(
                  entity.disputeBlockNumber,
                );
              if (entity.settlementBlockNumber && !entity.settlementTimestamp)
                entity.settlementTimestamp = timestampFor(
                  entity.settlementBlockNumber,
                );
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
              let entity: OOV1GraphEntity | OOV2GraphEntity =
                clientRequestToGraphEntity(request as OOV1Request);
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
              try {
                entity = await applyLiveRequestState(
                  provider,
                  pc.address,
                  pc.type,
                  request as OOV1Request,
                  entity,
                );
              } catch {
                // Non-fatal — fall back to the state implied by this tx's events
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
