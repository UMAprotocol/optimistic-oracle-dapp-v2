import Events from "events";
import { ethers } from "ethers";
import { assertAddress } from "@shared/utils";
import { parseIdentifier } from "@libs/utils";
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
import type { Request } from "@libs/oracle-sdk-v1/types/interfaces";
import { RequestState, requestId } from "@libs/clients/skinnyOptimisticOracle";
import { SkinnyOptimisticOracle } from "@libs/oracle-sdk-v1/services/skinnyOptimisticOracle";

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
    if (reward) result.reward = reward;
    if (finalFee) result.finalFee = finalFee;
    if (proposer) result.proposer = proposer;
    if (proposedPrice) result.proposedPrice = proposedPrice;
    if (expirationTime)
      result.proposalExpirationTimestamp = expirationTime.toString();
    if (disputer) result.disputer = disputer;
    if (price) result.settlementPrice = price;
    if (reward) result.settlementPayout = reward;
    if (settleTx) result.settlementHash = settleTx;
    if (requestBlockNumber)
      result.requestBlockNumber = requestBlockNumber.toString();
    if (requestTx) result.requestHash = requestTx;
    if (price) result.settlementPrice = price;
    if (reward) result.settlementPayout = reward;
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

    // unable to get the following values, omit their keys to avoid
    // overriding other sources when merged in final store
    // dont know how this comes from events
    // settlementRecipient: null
    // settlementTimestamp: null,
    // requestTimestamp: null,

    return result;
  };
export type Api = {
  updateFromTransactionReceipt: (receipt: TransactionReceipt) => void;
};
export const Factory = (config: Config): [ServiceFactory, Api] => {
  const convertToSharedRequest = ConvertToSharedRequest(
    config.chainId,
    assertAddress(config.address),
    "Skinny Optimistic Oracle"
  );
  const provider = new ethers.providers.JsonRpcProvider(config.url);
  const oo = new SkinnyOptimisticOracle(
    provider,
    config.address,
    config.chainId
  );
  const events = new Events();
  function updateFromTransactionReceipt(receipt: TransactionReceipt) {
    try {
      oo.updateFromTransactionReceipt(receipt);
      const requests: Request[] = oo.listRequests();
      const sharedRequests = requests.map((request) =>
        convertToSharedRequest(request)
      );
      events.emit("requests", sharedRequests);
    } catch (err) {
      console.warn("Error updating skinny v1 from receipt:", err);
    }
  }
  const service = (handlers: Handlers): Service => {
    if (handlers.requests) events.on("requests", handlers.requests);
  };

  return [
    service,
    {
      updateFromTransactionReceipt,
    },
  ];
};
