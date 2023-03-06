import { config } from "@/constants";
import { assertionToOracleQuery, requestToOracleQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import type {
  Allowance,
  Allowances,
  Assertion,
  Assertions,
  Balance,
  Balances,
  Request,
  Requests,
  Token,
  Tokens,
} from "@libs/oracle2";
import { Client } from "@libs/oracle2";
import { oracles, tokens } from "@libs/oracle2/services";
import type { ReactNode } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

const oraclesService = oracles.Factory(config.subgraphs);
const [tokenQueries, tokenService] = tokens.Factory(config.providers);

// tokenQueries has {token,allowance,balance} which you have to pass in chainid plus args for each call
export { oraclesService, tokenService, tokenQueries };

export type OracleQueryList = OracleQueryUI[];
export type OracleQueryTable = Record<string, OracleQueryUI>;
export type RequestTable = Record<string, Request>;
export type AssertionTable = Record<string, Assertion>;
export type Errors = Error[];
export type BalancesTable = Record<string, Balance>;
export type AllowancesTable = Record<string, Allowance>;
export type TokensTable = Record<string, Token>;
export interface OracleDataContextState {
  all: OracleQueryTable | undefined;
  verify: OracleQueryList | undefined;
  propose: OracleQueryList | undefined;
  settled: OracleQueryList | undefined;
  tokens: Tokens;
  allowances: Allowances;
  balances: Balances;
  errors: Errors;
}

export const defaultOracleDataContextState: OracleDataContextState = {
  all: undefined,
  verify: undefined,
  propose: undefined,
  settled: undefined,
  tokens: [],
  allowances: [],
  balances: [],
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState
);

type DispatchAction<Type extends string, Data> = {
  type: Type;
  data: Data;
};
type ProcessRequestsAction = DispatchAction<"requests", Requests>;
type ProcessAssertionsAction = DispatchAction<"assertions", Assertions>;
type ProcessBalancesAction = DispatchAction<"balances", Balances>;
type ProcessTokensAction = DispatchAction<"tokens", Tokens>;
type ProcessAllowancesAction = DispatchAction<"allowances", Allowances>;
type DispatchActions =
  | ProcessRequestsAction
  | ProcessAssertionsAction
  | ProcessBalancesAction
  | ProcessTokensAction
  | ProcessAllowancesAction;

function DataReducerFactory<Input extends Request | Assertion>(
  converter: (input: Input) => OracleQueryUI
) {
  return (
    state: OracleDataContextState,
    updates: Input[]
  ): OracleDataContextState => {
    const { all = {} } = state;
    updates.forEach((update) => {
      const queryUpdate = converter(update);
      all[update.id] = {
        ...(all[update.id] || {}),
        ...queryUpdate,
      };
    });
    const init: {
      verify: OracleQueryList;
      propose: OracleQueryList;
      settled: OracleQueryList;
    } = {
      verify: [],
      propose: [],
      settled: [],
    };
    const queries = Object.values(all).reduce((result, query) => {
      if (query.actionType === "Propose") {
        result.propose.push(query);
      } else if (
        query.actionType === "Dispute" ||
        query.actionType === "Settle"
      ) {
        result.verify.push(query);
      } else {
        result.settled.push(query);
      }
      return result;
    }, init);

    return {
      ...state,
      all: { ...all },
      ...queries,
    };
  };
}
const requestReducer = DataReducerFactory(requestToOracleQuery);
const assertionReducer = DataReducerFactory(assertionToOracleQuery);

function uniqueList<T>(list: T[], id: (el: T) => string): T[] {
  const init: Record<string, T> = {};
  return Object.values(
    list.reduce((table, el) => {
      table[id(el)] = el;
      return table;
    }, init)
  );
}

function balancesReducer(state: OracleDataContextState, updates: Balances) {
  return {
    ...state,
    balances: uniqueList([...state.balances, ...updates], (el: Balance) =>
      [el.chainId, el.tokenAddress, el.account].join("~")
    ),
  };
}
function tokensReducer(state: OracleDataContextState, updates: Tokens) {
  return {
    ...state,
    tokens: uniqueList([...state.tokens, ...updates], (el: Token) =>
      [el.chainId, el.tokenAddress].join("~")
    ),
  };
}
function allowancesReducer(state: OracleDataContextState, updates: Allowances) {
  return {
    ...state,
    allowances: uniqueList([...state.allowances, ...updates], (el: Allowance) =>
      [el.chainId, el.tokenAddress, el.account, el.spender].join("~")
    ),
  };
}

export function oracleDataReducer(
  state: OracleDataContextState,
  action: DispatchActions
): OracleDataContextState {
  if (action.type === "requests") {
    return requestReducer(state, action.data);
  } else if (action.type === "assertions") {
    return assertionReducer(state, action.data);
  } else if (action.type === "balances") {
    return balancesReducer(state, action.data);
  } else if (action.type === "allowances") {
    return allowancesReducer(state, action.data);
  } else if (action.type === "tokens") {
    return tokensReducer(state, action.data);
  }
  return state;
}
export function OracleDataProvider({ children }: { children: ReactNode }) {
  const [queries, dispatch] = useReducer(
    oracleDataReducer,
    defaultOracleDataContextState
  );
  const [errors, setErrors] = useState<Errors>(
    defaultOracleDataContextState.errors
  );

  useEffect(() => {
    // its important this client only gets initialized once
    Client([oraclesService, tokenService], {
      requests: (requests) => dispatch({ type: "requests", data: requests }),
      assertions: (assertions) =>
        dispatch({ type: "assertions", data: assertions }),
      balances: (balances) => dispatch({ type: "balances", data: balances }),
      allowances: (allowances) =>
        dispatch({ type: "allowances", data: allowances }),
      tokens: (tokens) => {
        dispatch({ type: "tokens", data: tokens });
      },
      errors: setErrors,
    });
  }, []);

  return (
    <OracleDataContext.Provider value={{ ...queries, errors }}>
      {children}
    </OracleDataContext.Provider>
  );
}
