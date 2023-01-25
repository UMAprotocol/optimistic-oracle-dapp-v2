import type { Event } from "ethers";
import { Interface } from "@ethersproject/abi";

import type { Signer, BigNumber, Contract } from "ethers";
export type { Overrides } from "@ethersproject/contracts";
export {
  Provider,
  JsonRpcSigner,
  JsonRpcProvider,
  Web3Provider,
  FallbackProvider,
} from "@ethersproject/providers";
export type {
  TransactionRequest,
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
export type { Event, Interface };

export type SerializableEvent = Omit<
  Event,
  | "decode"
  | "removeListener"
  | "getBlock"
  | "getTransaction"
  | "getTransactionReceipt"
>;

// taken from ethers code https://github.com/ethers-io/ethers.js/blob/master/packages/abi/src.ts/interface.ts#L654
export type Log = Parameters<Interface["parseLog"]>[0];
export type ParsedLog = ReturnType<Interface["parseLog"]>;
export type BigNumberish = string | number | BigNumber;
export type BN = BigNumber;
export { Signer, BigNumber, Contract };
