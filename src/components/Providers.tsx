"use client";

import {
  ErrorProvider,
  FilterAndSearchProvider,
  NotificationsProvider,
  OracleDataProvider,
  PageProvider,
  PanelProvider,
} from "@/contexts";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { chains, rainbowKitTheme, wagmiConfig } from "./WalletConfig";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
          <PageProvider>
            <NotificationsProvider>
              <ErrorProvider>
                <OracleDataProvider>
                  <PanelProvider>
                    <FilterAndSearchProvider>
                      {children}
                    </FilterAndSearchProvider>
                  </PanelProvider>
                </OracleDataProvider>
              </ErrorProvider>
            </NotificationsProvider>
          </PageProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
