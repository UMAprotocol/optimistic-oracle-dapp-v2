import { config } from "@/constants";
import {
  assertionToOracleQuery,
  requestToOracleQuery,
  sortQueriesByDate,
} from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { Client } from "@libs/oracle-sdk-v2";
import { oracles, oracle1Ethers } from "@libs/oracle-sdk-v2/services";
import type { Api } from "@libs/oracle-sdk-v2/services/oraclev1/ethers";
import type { ServiceFactories, ServiceFactory } from "@libs/oracle-sdk-v2";
import type { ProviderConfig } from "@/constants";
import type {
  Assertion,
  Assertions,
  Request,
  Requests,
  ChainId,
  OracleType,
} from "@shared/types";
import type { ReactNode } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

const oraclesService = oracles.Factory(config.subgraphs);

//TODO: hate this approach, will need to refactor in future, current services interface does not make it easy to define custom functions
// this will be moved somewhere else in future pr.
type EthersServicesList = [
  ServiceFactories,
  Partial<Record<OracleType, Partial<Record<ChainId, Api>>>>
];
const ethersServicesListInit: EthersServicesList = [[], {}];
const [oracleEthersServices, oracleEthersApis] = config.providers
  // TODO: this needs to be updated with oracle v2, v3, skinny based on config
  .map((config): [ProviderConfig, ServiceFactory, Api] => [
    config,
    ...oracle1Ethers.Factory(config),
  ])
  .reduce(
    (
      result: EthersServicesList,
      [config, service, api]
    ): EthersServicesList => {
      const apiRecords = {
        ...result[1],
        [config.type]: {
          ...(result[1][config.type] || {}),
          [config.chainId]: api,
        },
      };
      return [[...result[0], service], apiRecords];
    },
    ethersServicesListInit
  );

// This exposes any api calls to services to other parts of app
export { oraclesService, oracleEthersApis };

export type OracleQueryList = OracleQueryUI[];
export type OracleQueryTable = Record<string, OracleQueryUI>;
export type RequestTable = Record<string, Request>;
export type AssertionTable = Record<string, Assertion>;
export type Errors = (Error | undefined)[];

export interface OracleDataContextState {
  all: OracleQueryTable | undefined;
  verify: OracleQueryList | undefined;
  propose: OracleQueryList | undefined;
  settled: OracleQueryList | undefined;
  errors: Errors;
}

export const defaultOracleDataContextState: OracleDataContextState = {
  all: undefined,
  verify: undefined,
  propose: undefined,
  settled: undefined,
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState
);

type DispatchAction<Type extends string, Data> = {
  type: Type;
  data: Data;
};
// replace many requests, used when querying data from the graph
type ProcessRequestsAction = DispatchAction<"requests", Requests>;
// same thing with assertions
type ProcessAssertionsAction = DispatchAction<"assertions", Assertions>;

type DispatchActions = ProcessRequestsAction | ProcessAssertionsAction;

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
      if (query.actionType === "propose") {
        result.propose.push(query);
      } else if (
        query.actionType === "dispute" ||
        query.actionType === "settle"
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
      ...sortQueriesByDate(queries),
    };
  };
}

const requestReducer = DataReducerFactory(requestToOracleQuery);
const assertionReducer = DataReducerFactory(assertionToOracleQuery);

export function oracleDataReducer(
  state: OracleDataContextState,
  action: DispatchActions
): OracleDataContextState {
  if (action.type === "requests") {
    return requestReducer(state, action.data);
  } else if (action.type === "assertions") {
    return assertionReducer(state, action.data);
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
    Client([oraclesService, ...oracleEthersServices], {
      requests: (requests) => dispatch({ type: "requests", data: requests }),
      assertions: (assertions) =>
        dispatch({ type: "assertions", data: assertions }),
      errors: setErrors,
    });
  }, []);

  return (
    <OracleDataContext.Provider value={{ ...queries, errors }}>
      {children}
    </OracleDataContext.Provider>
  );
}
