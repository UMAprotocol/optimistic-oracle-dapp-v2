import type { OracleQueryUI } from "@/types";
import type { Address } from "wagmi";
import { erc20ABI, useAccount, useBalance, useContractRead } from "wagmi";

export function useBalanceAndAllowance(query: OracleQueryUI | undefined) {
  const { address } = useAccount();
  const { tokenAddress, oracleAddress, chainId } = query ?? {};
  const { data: balance } = useBalance({
    address,
    token: tokenAddress,
    chainId,
    enabled: !!address && !!tokenAddress && !!chainId,
  });
  const { data: allowance } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    chainId,
    // typecast is safe because hook is only enabled when these
    // values are defined (see below)
    args: [address as Address, oracleAddress as Address],
    enabled: !!address && !!tokenAddress && !!oracleAddress,
  });

  return {
    balance,
    allowance,
  };
}
