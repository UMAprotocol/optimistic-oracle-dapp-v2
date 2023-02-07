import { GlobalStyle } from "@/components";
import {
  infuraId,
  red500,
  supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import { PanelProvider } from "@/contexts";
import "@/styles/fonts.css";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { Client, OracleType } from "@libs/oracle2";
import { gql } from "@libs/oracle2/services";

const gqlService = gql.Factory([
  {
    url: "https://api.thegraph.com/subgraphs/name/md0x/goerli-oo-staging",
    type: OracleType.Optimistic,
    chainId: 5,
  },
]);

// example of using the client. hoook this up in a context / reducer
Client([gqlService], {
  requests: (requests) => console.log(requests),
  errors: (errors) => console.error(errors),
});

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
        <PanelProvider>
          <GlobalStyle />
          <Component {...pageProps} />
        </PanelProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
