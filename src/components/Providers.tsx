"use client";

import {
  ErrorProvider,
  FilterAndSearchProvider,
  NotificationsProvider,
  OracleDataProvider,
  PageProvider,
  PanelProvider,
  UrlBarProvider,
} from "@/contexts";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PageProvider>
      <NotificationsProvider>
        <ErrorProvider>
          <OracleDataProvider>
            <PanelProvider>
              <UrlBarProvider>
                <FilterAndSearchProvider>{children}</FilterAndSearchProvider>
              </UrlBarProvider>
            </PanelProvider>
          </OracleDataProvider>
        </ErrorProvider>
      </NotificationsProvider>
    </PageProvider>
  );
}
