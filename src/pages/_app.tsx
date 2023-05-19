import { GlobalStyle, Layout } from "@/components";
import {
  config,
  red500,
  chains as supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import {
  ErrorProvider,
  FilterAndSearchProvider,
  NotificationsProvider,
  OracleDataProvider,
  PageProvider,
  PanelProvider,
} from "@/contexts";
import "@/styles/fonts.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

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
        <PageProvider>
          <NotificationsProvider>
            <ErrorProvider>
              <OracleDataProvider>
                <PanelProvider>
                  <FilterAndSearchProvider>
                    <Layout>
                      <GlobalStyle />
                      <Component {...pageProps} />
                    </Layout>
                  </FilterAndSearchProvider>
                </PanelProvider>
              </OracleDataProvider>
            </ErrorProvider>
          </NotificationsProvider>
        </PageProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
