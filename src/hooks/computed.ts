import { tokenQueries } from "@/contexts";
import { findAllowance, findBalance, findToken } from "@/helpers";
import { useOracleDataContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { Token } from "@shared/types";
import type { BigNumber } from "ethers";
import { cloneDeep } from "lodash";
import { useEffect, useReducer } from "react";
import { useAccount } from "wagmi";

type State = {
  balance: BigNumber | null;
  allowance: BigNumber | null;
  token: Token | null;
};

type Action = {
  account: `0x${string}` | undefined;
  query: OracleQueryUI | undefined;
};
/**
 * Takes a query and returns computed values based on the query.
 */
export function useComputed(query: OracleQueryUI | undefined) {
  const initialState: State = {
    token: null,
    balance: null,
    allowance: null,
  };

  const { allowances, balances, tokens } = useOracleDataContext();
  const { address: account } = useAccount();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      account,
      query,
    });
  }, [account, query, allowances, balances, tokens]);

  function reducer(state: State, { account, query }: Action) {
    if (!account || !query) return cloneDeep(initialState);

    const newState = cloneDeep(state);

    const { tokenAddress, chainId, oracleAddress: spender } = query;

    const searchParams = {
      account,
      tokenAddress,
      chainId,
      spender,
    };

    const balance = findBalance(balances, searchParams);
    if (!balance) {
      tokenQueries.balance(
        {
          chainId,
          tokenAddress,
        },
        { account }
      );
    }

    const allowance = findAllowance(allowances, searchParams);
    if (!allowance) {
      tokenQueries.allowance(
        {
          chainId,
          tokenAddress,
        },
        { account, spender }
      );
    }

    const token = findToken(tokens, {
      tokenAddress,
      chainId,
    });
    if (!token) {
      tokenQueries.token({
        chainId,
        tokenAddress,
      });
    }

    newState.balance = balance;
    newState.allowance = allowance;
    newState.token = token;

    return newState;
  }

  return state;
}
