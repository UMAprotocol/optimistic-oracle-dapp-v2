// This is almost a direct copy of the OO v1 service, just with updated abis and different contract addresses
import type {
  BigNumberish,
  Provider,
  Signer,
  TransactionResponse,
  Log,
  TransactionReceipt,
} from "../types/ethers";
import type {
  OracleInterface,
  RequestKey,
  OracleProps,
  Request,
} from "../types/interfaces";
import {
  requestId,
  insertOrderedAscending,
  eventKey,
  isUnique,
} from "../utils";
import { optimisticOracleV2 } from "@libs/clients";

const { connect, getEventState } = optimisticOracleV2;

type Instance = optimisticOracleV2.Instance;
type RequestPrice = optimisticOracleV2.RequestPrice;
type ProposePrice = optimisticOracleV2.ProposePrice;
type DisputePrice = optimisticOracleV2.DisputePrice;
type Settle = optimisticOracleV2.Settle;
type RawRequest = optimisticOracleV2.Request;

export type OptimisticOracleEvent =
  | RequestPrice
  | ProposePrice
  | DisputePrice
  | Settle;

export type { RequestPrice, ProposePrice, DisputePrice, Settle };

export class OptimisticOracleV2 implements OracleInterface {
  private readonly contract: Instance;
  private readonly events: OptimisticOracleEvent[] = [];
  private requests: Record<string, Request> = {};
  constructor(
    protected provider: Provider,
    protected address: string,
    public readonly chainId: number
  ) {
    this.contract = connect(address, provider);
  }
  private upsertRequest = (request: RawRequest): Request => {
    const id = requestId(request);
    const cachedRequest = this.requests[id] || {};
    const update = {
      ...cachedRequest,
      ...request,
      ...(request.requestSettings || {}),
      chainId: this.chainId,
    };
    this.requests[id] = update;
    return update;
  };
  private setDisputeHash(
    { requester, identifier, timestamp, ancillaryData }: RequestKey,
    hash: string
  ): Request {
    return this.upsertRequest({
      requester,
      identifier,
      timestamp,
      ancillaryData,
      disputeTx: hash,
    });
  }
  private setProposeHash(
    { requester, identifier, timestamp, ancillaryData }: RequestKey,
    hash: string
  ): Request {
    return this.upsertRequest({
      requester,
      identifier,
      timestamp,
      ancillaryData,
      proposeTx: hash,
    });
  }
  private setSettleHash(
    { requester, identifier, timestamp, ancillaryData }: RequestKey,
    hash: string
  ): Request {
    return this.upsertRequest({
      requester,
      identifier,
      timestamp,
      ancillaryData,
      settleTx: hash,
    });
  }
  private updateFromEvents = (events: OptimisticOracleEvent[]) => {
    events.forEach((event) => {
      if (isUnique(this.events, event, eventKey)) {
        insertOrderedAscending(this.events, event, eventKey);
      }
    });
    const { requests = {} } = getEventState(this.events);
    Object.values(requests).map((request) => this.upsertRequest(request));
  };
  async fetchRequest({
    requester,
    identifier,
    timestamp,
    ancillaryData,
  }: RequestKey): Promise<Request> {
    const request = await this.contract.callStatic.getRequest(
      requester,
      identifier,
      timestamp,
      ancillaryData
    );
    const state = await this.contract.callStatic.getState(
      requester,
      identifier,
      timestamp,
      ancillaryData
    );
    return this.upsertRequest({
      ...request,
      state,
      requester,
      identifier,
      timestamp,
      ancillaryData,
    });
  }

  parseLog = (log: Log) => {
    const description = this.contract.interface.parseLog(log);
    return {
      ...log,
      ...description,
      event: description.name,
      eventSignature: description.signature,
    };
  };
  getRequest(key: RequestKey): Request {
    const id = requestId(key);
    const request = this.requests[id] || key;
    return { ...request };
  }
  async disputePrice(
    signer: Signer,
    { requester, identifier, timestamp, ancillaryData }: RequestKey
  ): Promise<TransactionResponse> {
    const contract = connect(this.address, signer);
    const tx = await contract.disputePrice(
      requester,
      identifier,
      timestamp,
      ancillaryData
    );
    this.setDisputeHash(
      { requester, identifier, timestamp, ancillaryData },
      tx.hash
    );
    return tx;
  }
  async proposePrice(
    signer: Signer,
    { requester, identifier, timestamp, ancillaryData }: RequestKey,
    price: BigNumberish
  ): Promise<TransactionResponse> {
    const contract = connect(this.address, signer);
    const tx = await contract.proposePrice(
      requester,
      identifier,
      timestamp,
      ancillaryData,
      price
    );
    this.setProposeHash(
      { requester, identifier, timestamp, ancillaryData },
      tx.hash
    );
    return tx;
  }
  async settle(
    signer: Signer,
    { requester, identifier, timestamp, ancillaryData }: RequestKey
  ): Promise<TransactionResponse> {
    const contract = connect(this.address, signer);
    const tx = await contract.settle(
      requester,
      identifier,
      timestamp,
      ancillaryData
    );
    this.setSettleHash(
      { requester, identifier, timestamp, ancillaryData },
      tx.hash
    );
    return tx;
  }
  async update(
    startBlock = 0,
    endBlock: number | "latest" = "latest"
  ): Promise<void> {
    const events = await this.contract.queryFilter({}, startBlock, endBlock);
    this.updateFromEvents(events as unknown[] as OptimisticOracleEvent[]);
  }
  async getProps(): Promise<OracleProps> {
    return {
      defaultLiveness: await this.contract.defaultLiveness(),
    };
  }
  updateFromTransactionReceipt(receipt: TransactionReceipt): void {
    const events = receipt.logs
      .map((log) => {
        try {
          return this.parseLog(log);
        } catch (err) {
          console.warn("Failed parsing log for oov2:", err);
        }
      })
      .filter(Boolean);
    this.updateFromEvents(events as unknown[] as OptimisticOracleEvent[]);
  }
  listRequests(): Request[] {
    return Object.values(this.requests);
  }
}
