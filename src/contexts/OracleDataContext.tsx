import type { ProviderConfig } from "@/constants";
import { config } from "@/constants";
import {
  assertionToOracleQuery,
  getPageForQuery,
  requestToOracleQuery,
  sortQueries,
} from "@/helpers";
import { useErrorContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { ServiceFactories, ServiceFactory } from "@libs/oracle-sdk-v2";
import { Client } from "@libs/oracle-sdk-v2";
import {
  oracle1Ethers,
  oracle2Ethers,
  oracle3Ethers,
  oracles,
  skinny1Ethers,
} from "@libs/oracle-sdk-v2/services";
import type { Api } from "@libs/oracle-sdk-v2/services/oraclev1/ethers";
import type {
  Assertion,
  Assertions,
  ChainId,
  OracleType,
  Request,
  Requests,
} from "@shared/types";
import unionWith from "lodash/unionWith";
import type { ReactNode } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

//TODO: hate this approach, will need to refactor in future, current services interface does not make it easy to define custom functions
// this will be moved somewhere else in future pr.
type EthersServicesList = [
  ServiceFactories,
  Partial<Record<OracleType, Partial<Record<ChainId, Api>>>>,
];
const ethersServicesListInit: EthersServicesList = [[], {}];
const [oracleEthersServices, oracleEthersApis] = config.providers
  .map((config): [ProviderConfig, ServiceFactory, Api] => {
    if (config.type === "Optimistic Oracle V1")
      return [config, ...oracle1Ethers.Factory(config)];
    if (config.type === "Optimistic Oracle V2")
      return [config, ...oracle2Ethers.Factory(config)];
    if (config.type === "Optimistic Oracle V3")
      return [config, ...oracle3Ethers.Factory(config)];
    // skinny optimistic oracle is left
    return [config, ...skinny1Ethers.Factory(config)];
  })
  .reduce(
    (
      result: EthersServicesList,
      [config, service, api],
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
    ethersServicesListInit,
  );

// This exposes any api calls to services to other parts of app
export { oracleEthersApis };

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
  defaultOracleDataContextState,
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

function mergeData(
  prev: OracleQueryUI | undefined,
  next: OracleQueryUI,
): OracleQueryUI {
  // we must merge data in more information, since the next data may be mission previously queried data
  const moreInformation = unionWith(
    prev?.moreInformation ?? [],
    next?.moreInformation ?? [],
    (a, b) => a.title === b.title,
  );
  return {
    ...(prev || {}),
    ...next,
    moreInformation,
  };
}
function DataReducerFactory<Input extends Request | Assertion>(
  converter: (input: Input) => OracleQueryUI,
) {
  return (
    state: OracleDataContextState,
    updates: Input[],
  ): OracleDataContextState => {
    const { all = {} } = state;
    updates.forEach((update) => {
      const queryUpdate = converter(update);
      all[update.id] = mergeData(all[update.id], queryUpdate);
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
      const pageForQuery = getPageForQuery(query);
      result[pageForQuery].push(query);
      return result;
    }, init);

    return {
      ...state,
      all: { ...all },
      ...sortQueries(queries),
    };
  };
}

const requestReducer = DataReducerFactory(requestToOracleQuery);
const assertionReducer = DataReducerFactory(assertionToOracleQuery);

export function oracleDataReducer(
  state: OracleDataContextState,
  action: DispatchActions,
): OracleDataContextState {
  if (action.type === "requests") {
    return requestReducer(state, action.data);
  } else if (action.type === "assertions") {
    return assertionReducer(state, action.data);
  }
  return state;
}
export function OracleDataProvider({ children }: { children: ReactNode }) {
  const { addErrorMessage } = useErrorContext();
  const oraclesServices = oracles.Factory(config.subgraphs);
  const serviceConfigs = [...config.subgraphs, ...config.providers];

  const [queries, dispatch] = useReducer(
    oracleDataReducer,
    defaultOracleDataContextState,
  );
  const [errors, setErrors] = useState<Errors>(
    defaultOracleDataContextState.errors,
  );

  useEffect(() => {
    // its important this client only gets initialized once
    Client([...oraclesServices, ...oracleEthersServices], {
      requests: (requests) => dispatch({ type: "requests", data: requests }),
      assertions: (assertions) =>
        dispatch({ type: "assertions", data: assertions }),
      errors: setErrors,
    });
  }, []);

  useEffect(() => {
    errors.forEach((error, i) => {
      if (error == undefined) return;
      // index of service must align with order configs are passed into client
      const serviceConfig = serviceConfigs[i];
      // this error is coming from ether provider queries, this would mean fallback is broken
      if (serviceConfig?.source !== "gql") {
        console.warn({ serviceConfig, error });
        addErrorMessage({
          text: "Currently unable to fetch all data, check back later",
          link: {
            text: "Use the Legacy Dapp instead",
            href: "https://legacy.oracle.uma.xyz",
          },
        });
        return;
      }
      const web3Fallback =
        oracleEthersApis?.[serviceConfig.type]?.[serviceConfig.chainId];
      if (web3Fallback?.queryLatestRequests) {
        const web3Config = config.providers.find(
          (c) =>
            c.type == serviceConfig.type && c.chainId == serviceConfig.chainId,
        );
        web3Fallback.queryLatestRequests(
          web3Config?.blockHistoryLimit ?? 100000,
        );
        // if we reach here, theres a subgraph thats not working, but we can still fetch limited  history through provider
        addErrorMessage({
          text: "The Graph is experiencing downtime, site may be slower than normal",
        });
      } else {
        // if we reach here, we dont have a fallback for a specific subgraph, technically this shouldnt ever happen though
        // if the app is configured correctly
        console.warn({ serviceConfig, error });
        addErrorMessage({
          text: "Currently unable to fetch all data, check back later",
          link: {
            text: "Use the Legacy Dapp instead",
            href: "https://legacy.oracle.uma.xyz",
          },
        });
      }
    });
  }, [errors]);

  return (
    <OracleDataContext.Provider value={{ ...queries, errors }}>
      {children}
    </OracleDataContext.Provider>
  );
}
