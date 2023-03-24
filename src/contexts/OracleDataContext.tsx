import { config } from "@/constants";
import { assertionToOracleQuery, requestToOracleQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { Client } from "@libs/oracle2";
import { oracles } from "@libs/oracle2/services";
import type { Assertion, Assertions, Request, Requests } from "@shared/types";
import type { ReactNode } from "react";
import { createContext, useEffect, useReducer, useState } from "react";

const oraclesService = oracles.Factory(config.subgraphs);

export { oraclesService };

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
      } else if (query.actionType === "dispute") {
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
    Client([oraclesService], {
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
