import Events from "events";
import { ethers } from "ethers";
import type { Interface } from "@ethersproject/abi";
import { assertAddress } from "@shared/utils";
import type { Assertion as SharedAssertion, ChainId } from "@shared/types";
import type { Address } from "wagmi";
import type {
  Handlers,
  Service,
  ServiceFactory,
} from "@libs/oracle-sdk-v2/types";
import type { TransactionReceipt, SerializableEvent } from "@libs/types";
import type { Assertion } from "@libs/clients/optimisticOracleV3";
import { connect, getEventState } from "@libs/clients/optimisticOracleV3";

type Log = Parameters<Interface["parseLog"]>[0];
export type Config = {
  chainId: ChainId;
  url: string;
  address: string;
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
    if (identifier) result.identifier = identifier;
    if (callbackRecipient) result.callbackRecipient = callbackRecipient;
    if (escalationManagerSettings?.escalationManager)
      result.escalationManager = escalationManagerSettings.escalationManager;
    if (assertionCaller) result.caller = assertionCaller;
    if (expirationTime) result.expirationTime = expirationTime.toString();
    if (currency) result.currency = assertAddress(currency);
    if (settlementResolution)
      result.settlementResolution = settlementResolution;
    if (bond) result.bond = bond;
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
};
export const Factory = (config: Config): [ServiceFactory, Api] => {
  const convertToSharedAssertion = ConvertToSharedAssertion(
    config.chainId,
    assertAddress(config.address)
  );
  const provider = new ethers.providers.JsonRpcProvider(config.url);
  const contract = connect(config.address, provider);
  // const oo = new OptimisticOracle(provider, config.address, config.chainId);
  const events = new Events();

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
      events.emit("assertions", sharedAssertions);
    } catch (err) {
      console.warn("Error updating v3 from tx receipt:", err);
    }
  }
  const service = (handlers: Handlers): Service => {
    if (handlers.assertions) events.on("assertions", handlers.assertions);
  };

  return [
    service,
    {
      updateFromTransactionReceipt,
    },
  ];
};
