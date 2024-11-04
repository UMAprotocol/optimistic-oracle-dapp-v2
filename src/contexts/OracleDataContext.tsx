"use client";

import type { ProviderConfig } from "@/constants";
import { config } from "@/constants";
import {
  assertionToOracleQuery,
  getPageForQuery,
  requestToOracleQuery,
  compareOracleQuery,
  SortedList,
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
import type { Assertion, ChainId, OracleType, Request } from "@shared/types";
import unionWith from "lodash/unionWith";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

//TODO: hate this approach, will need to refactor in future, current services interface does not make it easy to define custom functions
// this will be moved somewhere else in future pr.
type EthersServicesList = [
  ServiceFactories,
  Partial<Record<OracleType, Partial<Record<ChainId, Api>>>>,
];
// keep a list we can iterate easily over
export const oracleEthersApiList: Array<[ChainId, Api]> = [];
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
      oracleEthersApiList.push([config.chainId, api]);
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
const verifyList = new SortedList(compareOracleQuery, mergeData, (x) => x.id);
const proposeList = new SortedList(compareOracleQuery, mergeData, (x) => x.id);
const settledList = new SortedList(compareOracleQuery, mergeData, (x) => x.id);

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const { addErrorMessage } = useErrorContext();
  const oraclesServices = oracles.Factory(config.subgraphs);
  const serviceConfigs = [...config.subgraphs, ...config.providers];

  const [queries, setQueries] = useState(defaultOracleDataContextState);
  const [errors, setErrors] = useState<Errors>(
    defaultOracleDataContextState.errors,
  );
  useEffect(() => {
    let lastProposeUpdate = 0;
    let lastVerifyUpdate = 0;
    let lastSettledUpdate = 0;
    // sorted list of queries
    setInterval(() => {
      const state: OracleDataContextState = {
        errors: [],
        all: {},
        verify: verifyList.list,
        propose: proposeList.list,
        settled: settledList.list,
      };
      let dirty = false;
      if (verifyList.updateCount > lastVerifyUpdate) {
        state.verify = verifyList.toSortedArray();
        lastVerifyUpdate = verifyList.updateCount;
        dirty = true;
      }
      if (proposeList.updateCount > lastProposeUpdate) {
        state.propose = proposeList.toSortedArray();
        lastProposeUpdate = proposeList.updateCount;
        dirty = true;
      }
      if (settledList.updateCount > lastSettledUpdate) {
        state.settled = settledList.toSortedArray();
        lastSettledUpdate = settledList.updateCount;
        dirty = true;
      }
      if (dirty) {
        setQueries(state);
      }
    }, 5000);

    // its important this client only gets initialized once
    Client([...oraclesServices, ...oracleEthersServices], {
      requests: (requests) => {
        for (const req of requests) {
          const query = requestToOracleQuery(req);
          const prev =
            proposeList.get(query.id) ??
            verifyList.get(query.id) ??
            settledList.get(query.id);
          const merged = { ...prev, ...query };
          // we need to delete from previous list incase they moved from one to another changing state
          if (proposeList.has(query.id)) proposeList.delete(query.id);
          if (verifyList.has(query.id)) verifyList.delete(query.id);
          if (settledList.has(query.id)) settledList.delete(query.id);

          const pageForQuery = getPageForQuery(merged);
          if (pageForQuery === "propose") {
            proposeList.set(merged);
          } else if (pageForQuery === "settled") {
            settledList.set(merged);
          } else if (pageForQuery === "verify") {
            verifyList.set(merged);
          }
        }
      },
      assertions: (assertions) => {
        for (const a of assertions) {
          const query = assertionToOracleQuery(a);
          const prev =
            proposeList.get(query.id) ??
            verifyList.get(query.id) ??
            settledList.get(query.id);
          const pageForQuery = getPageForQuery(query);
          const merged = { ...prev, ...query };
          if (proposeList.has(query.id)) proposeList.delete(query.id);
          if (verifyList.has(query.id)) verifyList.delete(query.id);
          if (settledList.has(query.id)) settledList.delete(query.id);
          if (pageForQuery === "propose") {
            proposeList.upsert(merged);
          } else if (pageForQuery === "settled") {
            settledList.upsert(merged);
          } else if (pageForQuery === "verify") {
            verifyList.upsert(merged);
          }
        }
      },
      errors: setErrors,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    errors.forEach((error, i) => {
      if (error == undefined) return;
      // index of service must align with order configs are passed into client
      const serviceConfig = serviceConfigs[i];
      console.warn({ serviceConfig, error, i });
      // this error is coming from ether provider queries, this would mean fallback is broken
      if (serviceConfig?.source !== "gql") {
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
      if (web3Fallback && web3Fallback.queryLatestRequests) {
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
        addErrorMessage({
          text: "Currently unable to fetch all data, check back later",
          link: {
            text: "Use the Legacy Dapp instead",
            href: "https://legacy.oracle.uma.xyz",
          },
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return (
    <OracleDataContext.Provider value={{ ...queries, errors }}>
      {children}
    </OracleDataContext.Provider>
  );
}
