import type { Assertions, Requests, Transactions } from "@shared/types";

export {
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
  Web3Provider,
} from "@ethersproject/providers";

// This is the data transfer interface from client to view. Use this in a context or reducer to
// map state to whatever you need for display.
export type Handlers = {
  requests?: (requests: Requests) => void;
  assertions?: (assertions: Assertions) => void;
  transactions?: (transactions: Transactions) => void;
  // errors array indexes into server list. use this to determine which servers are failing
  errors?: (errors: (Error | undefined)[]) => void;
};

export type Service = {
  tick: () => Promise<void>;
};

// this is the interface to implement a server, servers gather information about requests/assertions from any source
export type ServiceFactory = (handlers: Handlers) => Service;
export type ServiceFactories = ServiceFactory[];
