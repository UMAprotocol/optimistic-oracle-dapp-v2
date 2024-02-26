import Events from "events";
import { ethers } from "ethers";
import type { Interface } from "@ethersproject/abi";
import { assertAddress } from "@shared/utils";
import {
  parseIdentifier,
  insertOrderedAscending,
  eventKey,
  isUnique,
  rangeStart,
  rangeSuccessDescending,
  rangeFailureDescending,
} from "@libs/utils";
import type { Assertion as SharedAssertion, ChainId } from "@shared/types";
import type { Address } from "wagmi";
import type {
  Handlers,
  Service,
  ServiceFactory,
} from "@libs/oracle-sdk-v2/types";
import type { TransactionReceipt, SerializableEvent } from "@libs/types";
import type {
  Assertion,
  AssertionMade,
  AssertionDisputed,
  AssertionSettled,
  AdminPropertiesSet,
} from "@libs/clients/optimisticOracleV3";
import { connect, getEventState } from "@libs/clients/optimisticOracleV3";

export type OptimisticOracleEvent =
  | AssertionMade
  | AssertionDisputed
  | AssertionSettled
  | AdminPropertiesSet;

type Log = Parameters<Interface["parseLog"]>[0];
export type Config = {
  chainId: ChainId;
  url: string;
  address: string;
};
// querying data from events does not provide timestamps for when events happen, at least not syncronously
// we have to do block lookups to get block timestamps to associate with events 🤮
const AddTimestamps =
  (provider: ethers.providers.JsonRpcProvider) =>
  async (assertion: SharedAssertion): Promise<SharedAssertion> => {
    if (assertion.assertionBlockNumber && !assertion.assertionTimestamp) {
      const block = await provider.getBlock(
        Number(assertion.assertionBlockNumber)
      );
      assertion.assertionTimestamp = block.timestamp.toString();
    }
    if (assertion.disputeBlockNumber && !assertion.disputeTimestamp) {
      const block = await provider.getBlock(
        Number(assertion.disputeBlockNumber)
      );
      assertion.disputeTimestamp = block.timestamp.toString();
    }
    if (assertion.settlementBlockNumber && !assertion.settlementTimestamp) {
      const block = await provider.getBlock(
        Number(assertion.settlementBlockNumber)
      );
      assertion.settlementTimestamp = block.timestamp.toString();
    }
    return assertion;
  };

const ConvertToSharedAssertion =
  (chainId: ChainId, oracleAddress: Address) =>
  (assertion: Assertion): SharedAssertion => {
    const {
      assertionId,
      claim,
      assertionCaller,

      // unused?
      // disputed,
      // bondRecipient,
      // disputeCaller,
      // settleCaller,
      // settled,
      // domainId,

      escalationManagerSettings,
      asserter,
      assertionTime,
      currency,
      expirationTime,
      settlementResolution,
      identifier,
      bond,
      callbackRecipient,
      disputer,

      assertionTx,
      assertionBlockNumber,
      assertionLogIndex,
      disputeTx,
      disputeBlockNumber,
      disputeLogIndex,
      settleTx,
      settleBlockNumber,
      settleLogIndex,
    } = assertion;

    const result: SharedAssertion = {
      id: assertionId,
      assertionId,
      chainId,
      oracleAddress,
      oracleType: "Optimistic Oracle V3",
    };
    if (claim) result.claim = claim;
    if (asserter) result.asserter = asserter;
    if (identifier) result.identifier = parseIdentifier(identifier);
    if (callbackRecipient) result.callbackRecipient = callbackRecipient;
    if (escalationManagerSettings?.escalationManager)
      result.escalationManager = escalationManagerSettings.escalationManager;
    if (assertionCaller) result.caller = assertionCaller;
    if (expirationTime) result.expirationTime = expirationTime.toString();
    if (currency) result.currency = assertAddress(currency);
    if (settlementResolution) {
      result.settlementResolution = settlementResolution;
    } else {
      // default this to true since its an assertion. if missing, UI will be missing data
      result.settlementResolution = true;
    }
    if (bond) result.bond = bond.toBigInt();
    if (assertionTime) result.assertionTimestamp = assertionTime.toString();
    if (assertionBlockNumber)
      result.assertionBlockNumber = assertionBlockNumber.toString();
    if (assertionTx) result.assertionHash = assertionTx;
    if (assertionLogIndex)
      result.assertionLogIndex = assertionLogIndex.toString();
    if (disputer) result.disputer = disputer;
    // unknown how to get this from events
    // if (settlementPayout) result.settlementPayout = settlementPayout;
    // if (settlementRecipient) result.settlementRecipient = settlementRecipient;
    // if (disputeTimestamp) result.disputeTimestamp = disputeTimestamp;
    if (disputeBlockNumber)
      result.disputeBlockNumber = disputeBlockNumber.toString();
    if (disputeTx) result.disputeHash = disputeTx;
    if (disputeLogIndex) result.disputeLogIndex = disputeLogIndex.toString();
    if (settleTx) result.settlementHash = settleTx;
    if (settleBlockNumber)
      result.settlementBlockNumber = settleBlockNumber.toString();
    if (settleLogIndex) result.settlementLogIndex = settleLogIndex.toString();

    return result;
  };
export type Api = {
  updateFromTransactionReceipt: (receipt: TransactionReceipt) => void;
  queryLatestRequests?: (blocksAgo: number) => void;
};
export const Factory = (config: Config): [ServiceFactory, Api] => {
  const convertToSharedAssertion = ConvertToSharedAssertion(
    config.chainId,
    assertAddress(config.address)
  );
  const provider = new ethers.providers.JsonRpcProvider(config.url);
  const addTimestamps = AddTimestamps(provider);
  const contract = connect(config.address, provider);
  const events = new Events();
  const logs: OptimisticOracleEvent[] = [];

  function parseLog(log: Log) {
    const description = contract.interface.parseLog(log);
    return {
      ...log,
      ...description,
      event: description.name,
      eventSignature: description.signature,
    };
  }

  function updateFromTransactionReceipt(receipt: TransactionReceipt) {
    try {
      const parsedLogs = receipt.logs
        .map((log) => {
          // ignore errors, its possible to have logs from other contracts in receipt
          try {
            return parseLog(log);
          } catch (err) {
            return false;
          }
        })
        .filter((x) => x);

      const { assertions = {} } = getEventState(
        parsedLogs as unknown as SerializableEvent[]
      );
      const sharedAssertions = Object.values(assertions).map((assertion) =>
        convertToSharedAssertion(assertion)
      );
      Promise.all(sharedAssertions.map(addTimestamps))
        .then((sharedAssertions) => {
          events.emit("assertions", sharedAssertions);
        })
        .catch((err) => {
          console.warn("Error updating v3 from tx receipt:", err);
        });
    } catch (err) {
      console.warn("Error updating v3 from tx receipt:", err);
    }
  }
  const service = (handlers: Handlers): Service => {
    if (handlers.assertions) events.on("assertions", handlers.assertions);
  };

  const updateFromEvents = (eventLogs: OptimisticOracleEvent[]) => {
    eventLogs.forEach((event) => {
      if (isUnique(logs, event, eventKey)) {
        insertOrderedAscending(logs, event, eventKey);
      }
    });
  };
  async function queryRange(startBlock: number, endBlock: number) {
    let rangeState = rangeStart({ startBlock, endBlock });
    const { currentStart, currentEnd } = rangeState;
    try {
      const eventLogs = await contract.queryFilter(
        {},
        currentStart,
        currentEnd
      );
      updateFromEvents(eventLogs as unknown[] as OptimisticOracleEvent[]);
      rangeState = rangeSuccessDescending({ ...rangeState, multiplier: 1 });
    } catch (err) {
      rangeState = rangeFailureDescending(rangeState);
    }
  }
  function queryLatestRequests(blocksAgo: number) {
    provider
      .getBlockNumber()
      .then(async (endBlock) => {
        const startBlock = endBlock - blocksAgo;
        await queryRange(startBlock, endBlock);
        const { assertions = {} } = getEventState(logs);
        const convertedAssertions = Object.values(assertions).map(
          convertToSharedAssertion
        );
        const assertionsWithTimestamps = await Promise.all(
          convertedAssertions.map(addTimestamps)
        );
        events.emit("assertions", assertionsWithTimestamps);
      })
      .catch((err) => {
        console.warn("error querying OOV3 assertions from web3 provider:", err);
        events.emit("error", err);
      });
  }

  return [
    service,
    {
      updateFromTransactionReceipt,
      queryLatestRequests,
    },
  ];
};
