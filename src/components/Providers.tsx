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
            <UrlBarProvider>
              <PanelProvider>
                <FilterAndSearchProvider>{children}</FilterAndSearchProvider>
              </PanelProvider>
            </UrlBarProvider>
          </OracleDataProvider>
        </ErrorProvider>
      </NotificationsProvider>
    </PageProvider>
  );
}
