import Events from "events";
import {
  Handlers,
  JsonRpcProvider,
  Token,
  Balance,
  Allowance,
  ServiceFactory,
  Service,
} from "../../types";
import assert from "assert";
import { TokenClient } from "../../web3-token";

export type ChainConfig = {
  chainId: number;
  provider: JsonRpcProvider;
};
export type TokenChain = {
  chainId: number;
  address: string;
};
export type Config = ChainConfig[];
export const Factory = (config: Config): [Queries, ServiceFactory] => {
  const events = new Events();
  const queries = Queries(config, (event: QueryEvent) =>
    events.emit("event", event)
  );
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
    config.map(({ chainId, provider }) => [chainId.toString(), provider])
  );
  const tokenClients: Record<string, TokenClient> = {};

  function getProvider(chainId: number): JsonRpcProvider {
    const provider = providers[chainId.toString()];
    assert(provider, `No provider set for chain ${chainId}`);
    return provider;
  }

  function getTokenClient({ chainId, address }: TokenChain): TokenClient {
    const id = [chainId, address].join("~");
    const client = tokenClients[id];
    if (client) return client;

    const config = {
      chainId,
      address,
      provider: getProvider(chainId),
    };
    tokenClients[id] = TokenClient(config);
    return tokenClients[id];
  }
  function token(config: TokenChain): void {
    getTokenClient(config)
      .props()
      .then((props) => {
        emit({ type: "token", data: { ...config, ...props } });
      })
      .catch((err) => {
        if (err instanceof Error) {
          emit({ type: "error", data: err });
        }
      });
  }
  function balance(config: TokenChain, account: string): void {
    getTokenClient(config)
      .balanceOf(account)
      .then((amount) => {
        emit({
          type: "balance",
          data: {
            tokenAddress: config.address,
            account,
            amount,
            chainId: config.chainId,
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
    config: TokenChain,
    spender: string,
    account: string
  ): void {
    getTokenClient(config)
      .allowance(account, spender)
      .then((amount) => {
        emit({
          type: "allowance",
          data: {
            tokenAddress: config.address,
            account,
            amount,
            spender,
            chainId: config.chainId,
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
