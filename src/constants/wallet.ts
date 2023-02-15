import { getDefaultWallets } from "@rainbow-me/rainbowkit";

import {
  arbitrum,
  avalanche,
  evmos,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

export const supportedChains = [
  mainnet,
  goerli,
  optimism,
  gnosis,
  polygon,
  evmos,
  arbitrum,
  avalanche,
  polygonMumbai,
];

export const supportedChainsById = {
  0: "Unsupported Chain" as const,
  1: "Ethereum" as const,
  5: "Görli" as const,
  10: "Optimism" as const,
  100: "Gnosis" as const,
  137: "Polygon" as const,
  288: "Boba" as const,
  416: "SX" as const,
  43114: "Avalanche" as const,
  42161: "Arbitrum" as const,
};

export const walletsAndConnectors = getDefaultWallets({
  appName: "Optimistic Oracle dApp V2",
  chains: supportedChains,
});

export const supportedCurrencies = ["USDC", "ETH", "RY"] as const;

export const ethersErrorCodes = [
  "CALL_EXCEPTION",
  "INSUFFICIENT_FUNDS",
  "MISSING_NEW",
  "NONCE_EXPIRED",
  "NUMERIC_FAULT",
  "REPLACEMENT_UNDERPRICED",
  "TRANSACTION_REPLACED",
  "UNPREDICTABLE_GAS_LIMIT",
];
