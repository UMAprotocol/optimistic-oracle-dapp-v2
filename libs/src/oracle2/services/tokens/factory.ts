import type { Allowance, Balance, Token } from "@shared/types";
import assert from "assert";
import { ethers } from "ethers";
import Events from "events";
import type {
  Handlers,
  JsonRpcProvider,
  Service,
  ServiceFactory,
} from "../../types";
import { TokenClient } from "../../web3-token";

export type ChainConfig = {
  chainId: number;
  url: string;
};
export type RequiredParams = {
  chainId: number;
  tokenAddress: string;
};
export type Config = ChainConfig[];
export const Factory = (config: Config): [Queries, ServiceFactory] => {
  const events = new Events();
  const queries = Queries(config, (event: QueryEvent) => {
    events.emit("event", event);
  });
  function ServiceFactory(handlers: Handlers): Service {
    events.on("event", (event: QueryEvent) => {
      if (event.type === "balance") {
        handlers.balances && handlers.balances([event.data]);
      } else if (event.type === "allowance") {
        handlers.allowances && handlers.allowances([event.data]);
      } else if (event.type === "token") {
        handlers.tokens && handlers.tokens([event.data]);
      } else if (event.type === "error") {
        handlers.errors && handlers.errors([event.data]);
      }
    });

    async function tick() {
      // do nothing
    }
    return { tick };
  }

  return [queries, ServiceFactory];
};

type BalanceEvent = {
  type: "balance";
  data: Balance;
};
type AllowanceEvent = {
  type: "allowance";
  data: Allowance;
};
type TokenEvent = {
  type: "token";
  data: Token;
};
type ErrorEvent = {
  type: "error";
  data: Error;
};
type QueryEvent = BalanceEvent | AllowanceEvent | TokenEvent | ErrorEvent;
type Emit = (event: QueryEvent) => unknown;

export function Queries(config: Config, emit: Emit) {
  const providers = Object.fromEntries(
    config.map(({ chainId, url }) => [
      chainId.toString(),
      new ethers.providers.JsonRpcProvider(url),
    ])
  );
  const tokenClients: Record<string, TokenClient> = {};

  function getProvider(chainId: number): JsonRpcProvider {
    const provider = providers[chainId.toString()];
    assert(provider, `No provider set for chain ${chainId}`);
    return provider;
  }

  function getTokenClient({
    chainId,
    tokenAddress,
  }: RequiredParams): TokenClient {
    const id = [chainId, tokenAddress].join("~");
    const client = tokenClients[id];
    if (client) return client;

    const config = {
      chainId,
      tokenAddress,
      provider: getProvider(chainId),
    };
    tokenClients[id] = TokenClient(config);
    return tokenClients[id];
  }
  function token(config: RequiredParams): void {
    getTokenClient(config)
      .props()
      .then((props) => {
        emit({ type: "token", data: { ...config, ...props } });
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error) {
          emit({ type: "error", data: err });
        }
      });
  }
  function balance(config: RequiredParams, params: { account: string }): void {
    getTokenClient(config)
      .balanceOf(params)
      .then((amount) => {
        emit({
          type: "balance",
          data: {
            ...config,
            ...params,
            amount,
          },
        });
      })
      .catch((err) => {
        if (err instanceof Error) {
          emit({ type: "error", data: err });
        }
      });
  }
  function allowance(
    config: RequiredParams,
    params: {
      spender: string;
      account: string;
    }
  ): void {
    getTokenClient(config)
      .allowance(params)
      .then((amount) => {
        emit({
          type: "allowance",
          data: {
            ...config,
            ...params,
            amount,
          },
        });
      })
      .catch((err) => {
        if (err instanceof Error) {
          emit({ type: "error", data: err });
        }
      });
  }
  return {
    token,
    allowance,
    balance,
  };
}
export type Queries = ReturnType<typeof Queries>;
