"use client";

import {
  config,
  chains as supportedChains,
  walletsAndConnectors,
} from "@/constants";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: config.alchemyId }),
  publicProvider(),
]);

const { connectors } = walletsAndConnectors;

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const rainbowKitTheme = darkTheme({
  accentColor: "var(--red-500)",
  accentColorForeground: "var(--white)",
  borderRadius: "small",
  overlayBlur: "small",
});
