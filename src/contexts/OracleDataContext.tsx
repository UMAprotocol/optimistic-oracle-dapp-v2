import {
  createContext,
  ReactNode,
  useReducer,
  useState,
  useEffect,
} from "react";

import { requestToOracleQuery, assertionToOracleQuery } from "@/helpers";
import { config } from "@/constants";
import { OracleQueryUI } from "@/types";
import {
  Client,
  Request,
  Requests,
  Assertion,
  Assertions,
} from "@libs/oracle2";
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

export const defaultOracleDataContextState: OracleDataContextState = {
  all: {},
  verify: [],
  propose: [],
  settled: [],
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
type DispatchActions = ProcessRequestsAction | ProcessAssertionsAction;

function DataReducerFactory<Input extends Request | Assertion>(
  converter: (input: Input) => OracleQueryUI
) {
  return (
    state: OracleDataContextState,
    updates: Input[]
  ): OracleDataContextState => {
    const { all } = state;
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
  };
}
const requestReducer = DataReducerFactory(requestToOracleQuery);
const assertionReducer = DataReducerFactory(assertionToOracleQuery);

function oracleDataReducer(
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
    Client([gqlService], {
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
