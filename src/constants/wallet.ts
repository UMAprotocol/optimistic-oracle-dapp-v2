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
  1: "Ethereum",
  5: "Görli",
  10: "Optimism",
  100: "Gnosis",
  137: "Polygon",
  288: "Boba",
  416: "SX",
  43114: "Avalanche",
  42161: "Arbitrum",
};

export const walletsAndConnectors = getDefaultWallets({
  appName: "Optimistic Oracle dApp V2",
  chains: supportedChains,
});
