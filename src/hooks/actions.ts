import { useAccount } from "wagmi";
import { useOracleDataContext, usePanelContext } from "@/hooks";
import { tokenQueries } from "@/contexts/OracleDataContext";
import { findBalance, findToken, findAllowance } from "@/helpers";

export function useActions() {
  const { allowances, balances, tokens } = useOracleDataContext();
  const { address } = useAccount();
  const { content: query } = usePanelContext();
  const actions: Record<string, () => void> = {};

  if (
    query &&
    address &&
    query.tokenAddress &&
    query.chainId &&
    query.oracleAddress
  ) {
    const oracleQueryParams = {
      account: address,
      tokenAddress: query.tokenAddress,
      chainId: query.chainId,
      spender: query.oracleAddress,
    };
    const currencyBalance = findBalance(balances, oracleQueryParams);
    if (!currencyBalance) {
      actions.fetchCurrencyBalance = () => {
        tokenQueries.balance(
          {
            chainId: query.chainId,
            // typescript thinks this doesnt exist, even though we check in the if statement
            tokenAddress: query.tokenAddress as string,
          },
          { account: address }
        );
      };
    }
    const currencyAllowance = findAllowance(allowances, oracleQueryParams);
    if (!currencyAllowance) {
      actions.fetchCurrencyAllowance = () => {
        tokenQueries.allowance(
          {
            chainId: query.chainId,
            tokenAddress: query.tokenAddress as string,
          },
          { account: address, spender: query.oracleAddress }
        );
      };
    }
    actions.sendCurrencyApprove = () => {
      // TODO: figure out best way to do this
      // prepareWriteContract({
      //   address: query.tokenAddress as `0x${string}`,
      //   abi: erc20Abi,
      //   functionName: "approve",
      //   args: [query.oracleAddress, MaxInt256.toString()],
      // })
      // .then(writeContract)
      // .then(setWatchTransaction)
      // .catch(err=>console.error('unable to approve',err));
    };
  }
  if (query && query.tokenAddress && query.chainId) {
    const token = findToken(tokens, {
      tokenAddress: query.tokenAddress,
      chainId: query.chainId,
    });
    if (!token) {
      actions.fetchCurrencyTokenInfo = () => {
        tokenQueries.token({
          chainId: query.chainId,
          tokenAddress: query.tokenAddress as string,
        });
      };
    }
  }
  return {
    actions,
  };
}
