import type { Contract, ethers, providers, Event, BigNumberish } from "ethers";
import type {
  TypedEventFilterEthers as TypedEventFilter,
  TypedEventEthers as TypedEvent,
} from "@uma/contracts-frontend";
import type { Provider } from "@ethersproject/providers";
import type { Signer } from "@ethersproject/abstract-signer";
export type { Log } from "@ethersproject/abstract-provider";
export type {
  TransactionRequest,
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";

export type {
  WaitForTransactionResult,
} from "@wagmi/core";

type Result = ethers.utils.Result;
export type { Result, BigNumberish };

export interface MakeId<I, D> {
  (d: D): I;
}
export interface MaybeId<I> {
  id?: I;
}
export interface HasId<I> {
  id: I;
}

export interface Callable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
}

export type SignerOrProvider =
  | providers.Provider
  | providers.BaseProvider
  | Signer
  | Provider
  | providers.JsonRpcProvider
  | ethers.Signer;

export type SerializableEvent = Omit<
  Event,
  | "decode"
  | "removeListener"
  | "getBlock"
  | "getTransaction"
  | "getTransactionReceipt"
>;

// this convoluted type is meant to cast events to the types you need based on the contract and event name
// example: type NewContractRegistered = GetEventType<Registry,"NewContractRegistered">;
// TODO: the any below is a hacky solution because some typechain types fail to resolve due to
// incompatible TypedEventFilter and TypedEvent types. This will be fixed by upgrading typechain
// to a version where Ethers events are exported as first class types.
export type GetEventType<
  ContractType extends Contract,
  EventName extends string
> = ReturnType<
  ContractType["filters"][EventName] extends Callable
    ? ContractType["filters"][EventName]
    : never
> extends TypedEventFilter<infer T, infer S>
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TypedEvent<T & S extends Result ? T & S : any>
  : never;
