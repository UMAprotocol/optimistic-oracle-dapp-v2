import {
  createContext,
  ReactNode,
  useReducer,
  useState,
  useEffect,
} from "react";

import { config } from "@/constants";
import {
  Client,
  Request,
  Requests,
  Assertion,
  Assertions,
} from "@libs/oracle2";
import { gql } from "@libs/oracle2/services";

const gqlService = gql.Factory(config.subgraphs);

export type RequestTable = Record<string, Request>;
export type AssertionTable = Record<string, Assertion>;
export type Errors = Error[];
export interface OracleDataContextState {
  requests: RequestTable;
  assertions: AssertionTable;
  errors: Errors;
}

export const defaultOracleDataContextState = {
  requests: {},
  assertions: {},
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState
);

// most likely we want to update this to index data by state, by transaction hash, and map the shape to something the views expect.
function requestReducer(
  requests: RequestTable,
  updates: Requests
): RequestTable {
  updates.forEach((update) => {
    requests[update.id] = {
      ...(requests[update.id] || {}),
      ...update,
    };
  });
  return requests;
}

function assertionReducer(
  assertions: AssertionTable,
  updates: Assertions
): AssertionTable {
  updates.forEach((update) => {
    assertions[update.id] = {
      ...(assertions[update.id] || {}),
      ...update,
    };
  });
  return assertions;
}

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const [requests, dispatchRequests] = useReducer(
    requestReducer,
    defaultOracleDataContextState.requests
  );
  const [assertions, dispatchAssertions] = useReducer(
    assertionReducer,
    defaultOracleDataContextState.assertions
  );
  const [errors, setErrors] = useState<Errors>(
    defaultOracleDataContextState.errors
  );

  useEffect(() => {
    // its important this client only gets initialized once
    Client([gqlService], {
      requests: dispatchRequests,
      assertions: dispatchAssertions,
      errors: setErrors,
    });
  }, []);

  return (
    <OracleDataContext.Provider value={{ errors, requests, assertions }}>
      {children}
    </OracleDataContext.Provider>
  );
}
