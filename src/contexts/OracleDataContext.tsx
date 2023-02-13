import {
  createContext,
  ReactNode,
  useReducer,
  useState,
  useEffect,
} from "react";

import { config } from "@/constants";
import { Client, Request } from "@libs/oracle2";
import { gql } from "@libs/oracle2/services";

const gqlService = gql.Factory(config.subgraphs);

export type RequestTable = Record<string, Request>;
export type Errors = Error[];
export interface OracleDataContextState {
  requests: RequestTable;
  errors: Errors;
}

export const defaultOracleDataContextState = {
  requests: {},
  errors: [],
};

export const OracleDataContext = createContext<OracleDataContextState>(
  defaultOracleDataContextState
);

// most likely we want to update this to index data by state, by transaction hash, and map the shape to something the views expect.
function requestReducer(
  requests: RequestTable,
  updates: Request[]
): RequestTable {
  updates.forEach((update) => {
    requests[update.id] = {
      ...(requests[update.id] || {}),
      ...update,
    };
  });
  return requests;
}

export function OracleDataProvider({ children }: { children: ReactNode }) {
  const [requests, dispatchRequests] = useReducer(
    requestReducer,
    defaultOracleDataContextState.requests
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
    <OracleDataContext.Provider value={{ errors, requests }}>
      {children}
    </OracleDataContext.Provider>
  );
}
