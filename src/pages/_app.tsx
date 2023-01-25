import { GlobalStyle } from "@/components";
import {
  infuraId,
  red500,
  supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import "@/styles/fonts.css";
import example from "@libs/example";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

example();

export const { chains, provider } = configureChains(supportedChains, [
  infuraProvider({ apiKey: infuraId }),
  publicProvider(),
]);

const { connectors } = walletsAndConnectors;

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const rainbowKitTheme = darkTheme({
  accentColor: red500,
  accentColorForeground: white,
  borderRadius: "small",
  overlayBlur: "small",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
