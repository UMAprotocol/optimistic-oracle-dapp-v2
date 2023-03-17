import type { OracleQueryUI } from "@/types";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useToken,
} from "wagmi";

export function useTokens(query: OracleQueryUI | undefined) {
  const { address } = useAccount();
  const { tokenAddress, oracleAddress, chainId } = query ?? {};
  const { data: token } = useToken({
    address: tokenAddress,
    chainId,
  });
  const { data: balance } = useBalance({
    address,
    token: tokenAddress,
  });
  const { data: allowance } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    // typecast is safe because hook is only enabled when these
    // values are defined (see below)
    args: [address as `0x${string}`, oracleAddress as `0x${string}`],
    enabled: !!address && !!tokenAddress && !!oracleAddress,
  });

  return {
    token,
    balance,
    allowance,
  };
}
