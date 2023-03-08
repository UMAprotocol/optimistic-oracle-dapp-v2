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

export const chains = [
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

export const chainsById = {
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
  80001: "Mumbai" as const,
};

export const chainNames = Object.values(chainsById);

export const walletsAndConnectors = getDefaultWallets({
  appName: "Optimistic Oracle dApp V2",
  chains,
});

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
