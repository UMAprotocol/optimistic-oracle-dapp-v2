"use client";

import {
  config,
  red500,
  chains as supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(supportedChains, [
  infuraProvider({ apiKey: config.infuraId }),
  publicProvider(),
]);

const { connectors } = walletsAndConnectors;

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider,
});

export const rainbowKitTheme = darkTheme({
  accentColor: red500,
  accentColorForeground: white,
  borderRadius: "small",
  overlayBlur: "small",
});

export function WalletConfig({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
