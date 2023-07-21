"use client";

import {
  ErrorBanner,
  Filters,
  Header,
  Notifications,
  Panel,
} from "@/components";
import { useHandleQueryInUrl, usePageContext } from "@/hooks";
import type { ReactNode } from "react";
import { LegacyDappLinkBanner } from "./LegacyDappLinkBanner";
import StyledComponentsRegistry from "./StyledComponentsRegistry";

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useHandleQueryInUrl();

  return (
    <StyledComponentsRegistry>
      <main>
        <LegacyDappLinkBanner />
        <ErrorBanner />
        <Header page={page} />
        <Filters />
        {children}
        <Panel />
        <Notifications />
      </main>
    </StyledComponentsRegistry>
  );
}
