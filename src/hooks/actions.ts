import { tokenQueries } from "@/contexts";
import { findAllowance, findBalance, findToken } from "@/helpers";
import { useOracleDataContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { useAccount } from "wagmi";

export function useActions(query: OracleQueryUI | undefined) {
  const { allowances, balances, tokens } = useOracleDataContext();
  const { tokenAddress, chainId, oracleAddress: spender } = query || {};
  const { address: account } = useAccount();
  const actions: Record<string, () => void> = {};

  if (query && account && tokenAddress && chainId && spender) {
    const oracleQueryParams = {
      account,
      tokenAddress,
      chainId,
      spender,
    };
    const currencyBalance = findBalance(balances, oracleQueryParams);
    if (!currencyBalance) {
      actions.fetchCurrencyBalance = () => {
        tokenQueries.balance(
          {
            chainId,
            tokenAddress,
          },
          { account }
        );
      };
    }
    const currencyAllowance = findAllowance(allowances, oracleQueryParams);
    if (!currencyAllowance) {
      actions.fetchCurrencyAllowance = () => {
        tokenQueries.allowance(
          {
            chainId,
            tokenAddress,
          },
          { account, spender }
        );
      };
    }
    actions.sendCurrencyApprove = () => {
      // TODO: figure out best way to do this
      // prepareWriteContract({
      //   address: tokenAddress as `0x${string}`,
      //   abi: erc20Abi,
      //   functionName: "approve",
      //   args: [spender, MaxInt256.toString()],
      // })
      // .then(writeContract)
      // .then(setWatchTransaction)
      // .catch(err=>console.error('unable to approve',err));
    };
  }
  if (query && tokenAddress && chainId) {
    const token = findToken(tokens, {
      tokenAddress,
      chainId,
    });
    if (!token) {
      actions.fetchCurrencyTokenInfo = () => {
        tokenQueries.token({
          chainId,
          tokenAddress,
        });
      };
    }
  }

  return actions;
}
