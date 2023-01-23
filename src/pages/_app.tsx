import { GlobalStyle } from "@/components";
import { infuraId, supportedChains, walletsAndConnectors } from "@/constants";
import "@/styles/fonts.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <GlobalStyle />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
