import {
  ErrorProvider,
  FilterAndSearchProvider,
  NotificationsProvider,
  OracleDataProvider,
  PageProvider,
  PanelProvider
} from "@/contexts";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PageProvider>
      <NotificationsProvider>
        <ErrorProvider>
          <OracleDataProvider>
            <PanelProvider>
              <FilterAndSearchProvider>{children}</FilterAndSearchProvider>
            </PanelProvider>
          </OracleDataProvider>
        </ErrorProvider>
      </NotificationsProvider>
    </PageProvider>
  );
}
