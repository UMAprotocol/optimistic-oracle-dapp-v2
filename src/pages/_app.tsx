import { GlobalStyle } from "@/components";
import {
  config,
  red500,
  supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import { ErrorProvider, PanelProvider } from "@/contexts";
import "@/styles/fonts.css";
import { Client } from "@libs/oracle2";
import { gql } from "@libs/oracle2/services";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const gqlService = gql.Factory(config.subgraphs);

// example of using the client. hoook this up in a context / reducer
Client([gqlService], {
  requests: (requests) => console.log(requests),
  errors: (errors) => console.error(errors),
});

export const { chains, provider } = configureChains(supportedChains, [
  infuraProvider({ apiKey: config.infuraId }),
  publicProvider(),
]);

const { connectors } = walletsAndConnectors;

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const rainbowKitTheme = darkTheme({
  accentColor: red500,
  accentColorForeground: white,
  borderRadius: "small",
  overlayBlur: "small",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        <ErrorProvider>
          <PanelProvider>
            <GlobalStyle />
            <Component {...pageProps} />
          </PanelProvider>
        </ErrorProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
