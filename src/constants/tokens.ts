import type { Address } from "wagmi";

// Add chains as we support bridged usdc
const USDC_MAP: Record<number, Record<Address, string>> = {
  137: {
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": "USDC.e",
  },
};

export function resolveUsdcSymbol(
  chainId: number | undefined,
  address: Address | undefined,
) {
  if (!chainId || !address) return;
  return Object.entries(USDC_MAP?.[chainId] ?? {})?.find(
    ([add, _]) => add.toLowerCase() === address.toLowerCase(),
  )?.[1];
}
