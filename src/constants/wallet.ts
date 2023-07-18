import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { config } from "@/constants";

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

export const walletsAndConnectors = getDefaultWallets({
  appName: "Optimistic Oracle dApp V2",
  chains,
  projectId: config.walletconnectProjectId,
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
