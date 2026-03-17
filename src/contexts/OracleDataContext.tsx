"use client";

import type { ProviderConfig } from "@/constants";
import { config } from "@/constants";
import {
  assertionToOracleQuery,
  requestToOracleQuery,
  sortByTimeCreated,
} from "@/helpers";
import { useVerifyData, useProposeData, useSettledData } from "@/hooks/oracle";
import type { OracleQueryResult } from "@/hooks/oracle";
import { projects } from "@/projects";
import type { OracleQueryUI } from "@/types";
import type { ServiceFactories, ServiceFactory } from "@libs/oracle-sdk-v2";
import { PageContext } from "./PageContext";
import {
  oracle1Ethers,
  oracle2Ethers,
  oracle3Ethers,
  skinny1Ethers,
  oracleManagedEthers,
} from "@libs/oracle-sdk-v2/services";
import type { Api } from "@libs/oracle-sdk-v2/services/oraclev1/ethers";
import type { ChainId, OracleType } from "@shared/types";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
} from "react";

// --- Ethers APIs (module-level, used for transaction updates) ---
type EthersServicesList = [
  ServiceFactories,
  Partial<Record<OracleType, Partial<Record<ChainId, Api>>>>,
];
const oracleEthersApiList: Array<[ChainId, Api]> = [];
const ethersServicesListInit: EthersServicesList = [[], {}];
const [oracleEthersServices] = config.providers
  .map((config): [ProviderConfig, ServiceFactory, Api] => {
    if (config.type === "Optimistic Oracle V1")
      return [config, ...oracle1Ethers.Factory(config)];
    if (config.type === "Optimistic Oracle V2")
      return [config, ...oracle2Ethers.Factory(config)];
    if (config.type === "Optimistic Oracle V3")
      return [config, ...oracle3Ethers.Factory(config)];
    if (config.type === "Managed Optimistic Oracle V2")
      return [config, ...oracleManagedEthers.Factory(config)];
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

// --- Context types ---
export type OracleQueryList = OracleQueryUI[];
export type OracleQueryTable = Record<string, OracleQueryUI>;
export type Errors = (Error | undefined)[];

export interface OracleDataContextState {
  all: OracleQueryTable;
  verify: OracleQueryList;
  propose: OracleQueryList;
  settled: OracleQueryList;
  errors: Errors;
}

export const defaultOracleDataContextState: OracleDataContextState = {
  all: {},
  verify: [],
  propose: [],
  settled: [],
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState,
);

// --- Helpers ---

function convertResults(result: OracleQueryResult): OracleQueryUI[] {
  const queries: OracleQueryUI[] = [];

  for (const req of result.requests) {
    const query = requestToOracleQuery(req);
    const project = Object.values(projects).find(
      (p) => p.name === query.project,
    );
    if (!project?.hideRequests) {
      queries.push(query);
    }
  }

  for (const assertion of result.assertions) {
    const query = assertionToOracleQuery(assertion);
    const project = Object.values(projects).find(
      (p) => p.name === query.project,
    );
    if (!project?.hideRequests) {
      queries.push(query);
    }
  }

  return sortByTimeCreated(queries);
}

function buildAllTable(
  ...lists: (OracleQueryUI[] | undefined)[]
): OracleQueryTable {
  const all: OracleQueryTable = {};
  for (const list of lists) {
    if (!list) continue;
    for (const query of list) {
      all[query.id] = query;
    }
  }
  return all;
}

// --- Provider ---

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const { page } = useContext(PageContext);

  // Each page fetches only its own data
  const verifyResult = useVerifyData();
  const proposeResult = useProposeData(page === "propose");
  const settledResult = useSettledData(page === "settled");

  // Convert raw requests/assertions to OracleQueryUI, sorted.
  // Results trickle in as each subgraph query resolves — no need to wait for all.
  const verify = useMemo(
    () => convertResults(verifyResult),
    [verifyResult.requests, verifyResult.assertions],
  );

  const propose = useMemo(
    () => convertResults(proposeResult),
    [proposeResult.requests, proposeResult.assertions],
  );

  const settled = useMemo(
    () => convertResults(settledResult),
    [settledResult.requests, settledResult.assertions],
  );

  // Defer heavy downstream rendering so the UI stays responsive while
  // subgraph results trickle in. React will render with stale data first,
  // then update in a lower-priority pass that can be interrupted.
  const deferredVerify = useDeferredValue(verify);
  const deferredPropose = useDeferredValue(propose);
  const deferredSettled = useDeferredValue(settled);

  // Lookup table for useQueryById (panel)
  const all = useMemo(
    () => buildAllTable(deferredVerify, deferredPropose, deferredSettled),
    [deferredVerify, deferredPropose, deferredSettled],
  );

  // Connect ethers services for transaction updates
  useEffect(() => {
    oracleEthersServices.forEach((factory) => {
      factory({
        // Ethers transaction updates are rare — for now they're no-ops since
        // the per-page hooks will pick up changes on next refetch
        requests: () => {},
        assertions: () => {},
      });
    });
  }, []);

  const errors: Errors = [
    ...verifyResult.errors,
    ...proposeResult.errors,
    ...settledResult.errors,
  ];

  const value = useMemo(
    () => ({
      all,
      verify: deferredVerify,
      propose: deferredPropose,
      settled: deferredSettled,
      errors,
    }),
    [all, deferredVerify, deferredPropose, deferredSettled, errors],
  );

  return (
    <OracleDataContext.Provider value={value}>
      {children}
    </OracleDataContext.Provider>
  );
}
