import { tokenQueries } from "@/contexts";
import { findAllowance, findBalance, findToken } from "@/helpers";
import { useOracleDataContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { Token } from "@shared/types";
import type { BigNumber } from "ethers";
import { useAccount } from "wagmi";

type Computed = {
  currencyBalance: BigNumber | null;
  fetchCurrencyBalance?: () => void;
  currencyAllowance: BigNumber | null;
  fetchCurrencyAllowance?: () => void;
  token: Token | null;
  fetchCurrencyTokenInfo?: () => void;
  sendCurrencyApprove?: () => void;
};
export function useComputed(query: OracleQueryUI | undefined) {
  const { allowances, balances, tokens } = useOracleDataContext();
  const { tokenAddress, chainId, oracleAddress: spender } = query || {};
  const { address: account } = useAccount();
  const computed: Computed = {
    currencyBalance: null,
    currencyAllowance: null,
    token: null,
  };

  if (query && account && tokenAddress && chainId && spender) {
    const oracleQueryParams = {
      account,
      tokenAddress,
      chainId,
      spender,
    };
    const currencyBalance = findBalance(balances, oracleQueryParams);
    computed.currencyBalance = currencyBalance;
    if (!currencyBalance) {
      computed.fetchCurrencyBalance = () => {
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
    computed.currencyAllowance = currencyAllowance;
    if (!currencyAllowance) {
      computed.fetchCurrencyAllowance = () => {
        tokenQueries.allowance(
          {
            chainId,
            tokenAddress,
          },
          { account, spender }
        );
      };
    }
    computed.sendCurrencyApprove = () => {
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
    computed.token = token;

    if (!token) {
      computed.fetchCurrencyTokenInfo = () => {
        tokenQueries.token({
          chainId,
          tokenAddress,
        });
      };
    }
  }

  return computed;
}
