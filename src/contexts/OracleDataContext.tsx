import {
  createContext,
  ReactNode,
  useReducer,
  useState,
  useEffect,
} from "react";

import { requestToOracleQuery } from "@/helpers";
import { config } from "@/constants";
import { OracleQueryUI } from "@/types";
import { Client, Request, Requests, Assertion } from "@libs/oracle2";
import { gql } from "@libs/oracle2/services";

const gqlService = gql.Factory(config.subgraphs);

export type OracleQueryList = OracleQueryUI[];
export type OracleQueryTable = Record<string, OracleQueryUI>;
export type RequestTable = Record<string, Request>;
export type AssertionTable = Record<string, Assertion>;
export type Errors = Error[];
export interface OracleDataContextState {
  all: OracleQueryTable;
  verify: OracleQueryList;
  propose: OracleQueryList;
  settled: OracleQueryList;
  errors: Errors;
}

export const defaultOracleDataContextState = {
  all: {},
  verify: [],
  propose: [],
  settled: [],
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState
);

// most likely we want to update this to index data by state, by transaction hash, and map the shape to something the views expect.
function requestReducer(
  state: OracleDataContextState,
  updates: Requests
): OracleDataContextState {
  const { all } = state;
  updates.forEach((update) => {
    const queryUpdate = requestToOracleQuery(update);
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
    } else if (query.actionType === "Dispute") {
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
}

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const [queries, dispatchRequests] = useReducer(
    requestReducer,
    defaultOracleDataContextState
  );
  const [errors, setErrors] = useState<Errors>(
    defaultOracleDataContextState.errors
  );

  useEffect(() => {
    // its important this client only gets initialized once
    Client([gqlService], {
      requests: dispatchRequests,
      errors: setErrors,
    });
  }, []);

  return (
    <OracleDataContext.Provider value={{ ...queries, errors }}>
      {children}
    </OracleDataContext.Provider>
  );
}
