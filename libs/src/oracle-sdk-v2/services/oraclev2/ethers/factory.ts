import Events from "events";
import { ethers } from "ethers";
import { assertAddress } from "@shared/utils";
import {
  parseIdentifier,
  rangeStart,
  rangeSuccessDescending,
  rangeFailureDescending,
} from "@libs/utils";
import type {
  Request as SharedRequest,
  OracleType,
  ChainId,
  RequestState as SharedRequestState,
} from "@shared/types";
import type { Address } from "wagmi";
import type {
  Handlers,
  Service,
  ServiceFactory,
} from "@libs/oracle-sdk-v2/types";
import type { TransactionReceipt } from "@libs/types";
import type { Request } from "@libs/clients/optimisticOracleV2";
import { RequestState, requestId } from "@libs/clients/optimisticOracleV2";
import { OptimisticOracleV2 } from "@libs/oracle-sdk-v1/services/optimisticOracleV2";

export type Config = {
  chainId: ChainId;
  url: string;
  address: string;
};

function convertToSharedState(state: RequestState): SharedRequestState {
  if (state === RequestState.Invalid) return "Invalid";
  if (state === RequestState.Requested) return "Requested";
  if (state === RequestState.Proposed) return "Proposed";
  if (state === RequestState.Expired) return "Expired";
  if (state === RequestState.Disputed) return "Disputed";
  if (state === RequestState.Resolved) return "Resolved";
  return "Settled";
}

// querying data from events does not provide timestamps for when events happen, at least not syncronously
// we have to do block lookups to get block timestamps to associate with events 🤮
const AddTimestamps =
  (provider: ethers.providers.JsonRpcProvider) =>
  async (request: SharedRequest): Promise<SharedRequest> => {
    if (request.requestBlockNumber && !request.requestTimestamp) {
      const block = await provider.getBlock(Number(request.requestBlockNumber));
      request.requestTimestamp = block.timestamp.toString();
    }
    if (request.disputeBlockNumber && !request.disputeTimestamp) {
      const block = await provider.getBlock(Number(request.disputeBlockNumber));
      request.disputeTimestamp = block.timestamp.toString();
    }
    if (request.settlementBlockNumber && !request.settlementTimestamp) {
      const block = await provider.getBlock(
        Number(request.settlementBlockNumber),
      );
      request.settlementTimestamp = block.timestamp.toString();
    }
    return request;
  };

const ConvertToSharedRequest =
  (chainId: ChainId, oracleAddress: Address, oracleType: OracleType) =>
  (request: Request): SharedRequest => {
    const {
      requester,
      identifier,
      timestamp,
      ancillaryData,
      currency,
      reward,
      finalFee,
      proposer,
      proposedPrice,
      expirationTime,
      disputer,
      price,
      settleTx,
      requestTx,
      proposeTx,
      disputeTx,
      requestBlockNumber,
      proposeBlockNumber,
      disputeBlockNumber,
      settleBlockNumber,
      requestLogIndex,
      proposeLogIndex,
      disputeLogIndex,
      settleLogIndex,
      state,
      bond,
    } = request;
    const id = requestId(request);

    const result: SharedRequest = {
      id,
      chainId,
      oracleAddress,
      oracleType,
      requester: assertAddress(requester),
      identifier: parseIdentifier(identifier),
      time: timestamp.toString(),
      ancillaryData,
    };
    if (currency) result.currency = assertAddress(currency);
    if (reward) result.reward = reward.toBigInt();
    if (finalFee) result.finalFee = finalFee.toBigInt();
    if (proposer) result.proposer = proposer;
    if (proposedPrice) result.proposedPrice = proposedPrice.toBigInt();
    if (expirationTime && expirationTime.toNumber() > 0)
      result.proposalExpirationTimestamp = expirationTime.toString();
    if (disputer) result.disputer = disputer;
    if (price) result.settlementPrice = price.toBigInt();
    if (reward) result.settlementPayout = reward.toBigInt();
    if (settleTx) result.settlementHash = settleTx;
    if (requestBlockNumber)
      result.requestBlockNumber = requestBlockNumber.toString();
    if (requestTx) result.requestHash = requestTx;
    if (price) result.settlementPrice = price.toBigInt();
    if (reward) result.settlementPayout = reward.toBigInt();
    if (settleTx) result.settlementHash = settleTx;
    if (requestBlockNumber)
      result.requestBlockNumber = requestBlockNumber.toString();
    if (requestTx) result.requestHash = requestTx;
    if (state) result.state = convertToSharedState(state);
    if (proposeTx) result.proposalHash = proposeTx;
    if (disputeTx) result.disputeHash = disputeTx;
    if (proposeBlockNumber)
      result.proposalBlockNumber = proposeBlockNumber.toString();
    if (disputeBlockNumber)
      result.disputeBlockNumber = disputeBlockNumber.toString();
    if (requestLogIndex) result.requestLogIndex = requestLogIndex.toString();
    if (proposeLogIndex) result.proposalLogIndex = proposeLogIndex.toString();
    if (disputeLogIndex) result.disputeLogIndex = disputeLogIndex.toString();
    if (settleBlockNumber)
      result.settlementBlockNumber = settleBlockNumber.toString();
    if (settleLogIndex) result.settlementLogIndex = settleLogIndex.toString();
    if (bond) result.bond = bond.toBigInt();
    // unable to get the following values, omit their keys to avoid
    // overriding other sources when merged in final store
    // dont know how this comes from events
    // settlementRecipient: null
    // settlementTimestamp: null,
    // requestTimestamp: null,

    return result;
  };
export type Api = {
  updateFromTransactionReceipt: (receipt: TransactionReceipt) => Promise<void>;
  queryLatestRequests?: (blocksAgo: number) => void;
  updateFromTransactionHash?: (transactionHash: string) => Promise<void>;
};
export const Factory = (config: Config): [ServiceFactory, Api] => {
  const convertToSharedRequest = ConvertToSharedRequest(
    config.chainId,
    assertAddress(config.address),
    "Optimistic Oracle V2",
  );
  const provider = new ethers.providers.JsonRpcProvider(config.url);
  const oo = new OptimisticOracleV2(provider, config.address, config.chainId);
  const events = new Events();
  const addTimestamps = AddTimestamps(provider);
  async function updateFromTransactionReceipt(receipt: TransactionReceipt) {
    try {
      await oo.updateFromTransactionReceipt(receipt);
      const requests: Request[] = oo.listRequests();
      const sharedRequests = requests.map((request) =>
        convertToSharedRequest(request),
      );
      events.emit("requests", sharedRequests);
    } catch (err) {
      console.warn("Error updating oov2 from receipt:", err);
    }
  }
  async function updateFromTransactionHash(transactionHash: string) {
    const receipt = await provider.getTransactionReceipt(transactionHash);
    await updateFromTransactionReceipt(receipt);
  }
  const service = (handlers: Handlers): Service => {
    if (handlers.requests) events.on("requests", handlers.requests);
  };
  async function queryRange(startBlock: number, endBlock: number) {
    let rangeState = rangeStart({ startBlock, endBlock, maxRange: 10000 });
    do {
      const { currentStart, currentEnd } = rangeState;
      try {
        await oo.update(currentStart, currentEnd);
        rangeState = rangeSuccessDescending({ ...rangeState, multiplier: 1 });
      } catch (err) {
        console.error(err, "Error loading oov ethers range");
        rangeState = rangeFailureDescending({ ...rangeState, multiplier: 2 });
      }
    } while (!rangeState.done);
  }

  function queryLatestRequests(blocksAgo: number, deployBlock?: number) {
    provider
      .getBlockNumber()
      .then(async (endBlock) => {
        const defaultStartBlock = endBlock - blocksAgo;
        const startBlock = deployBlock
          ? Math.max(defaultStartBlock, deployBlock)
          : defaultStartBlock;
        await queryRange(startBlock, endBlock);
        const requests = oo.listRequests();
        const convertedRequests: SharedRequest[] = Object.values(requests).map(
          convertToSharedRequest,
        );
        const requestsWithTimestamps = await Promise.all(
          convertedRequests.map(addTimestamps),
        );
        events.emit("requests", requestsWithTimestamps);
      })
      .catch((err) => {
        console.warn(
          "error querying latest OOV2 requests from web3 provider:",
          err,
        );
        events.emit("error", err);
      });
  }

  return [
    service,
    {
      updateFromTransactionReceipt,
      queryLatestRequests,
      updateFromTransactionHash,
    },
  ];
};
