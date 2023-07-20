"use client";

import {
  ErrorBanner,
  Filters,
  GlobalStyle,
  Header,
  Notifications,
  Panel,
} from "@/components";
import {
  chains as supportedChains,
  config,
  red500,
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
import { useHandleQueryInUrl, usePageContext } from "@/hooks";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import type { ReactNode } from "react";
import styled from "styled-components";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { LegacyDappLinkBanner } from "./LegacyDappLinkBanner";

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

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useHandleQueryInUrl();

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
                      <Main>
                        <LegacyDappLinkBanner />
                        <ErrorBanner />
                        <Header page={page} />
                        <Filters />
                        {children}
                        <Panel />
                        <Notifications />
                      </Main>
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

const Main = styled.main`
  height: 100%;
`;
