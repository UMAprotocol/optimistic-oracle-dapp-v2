"use client";

import {
  ErrorBanner,
  Filters,
  GlobalStyle,
  Header,
  Notifications,
  Panel,
} from "@/components";
import { useHandleQueryInUrl, usePageContext } from "@/hooks";
import type { ReactNode } from "react";
import { LegacyDappLinkBanner } from "./LegacyDappLinkBanner";

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useHandleQueryInUrl();

  return (
    <>
      <GlobalStyle />
      <main>
        <LegacyDappLinkBanner />
        <ErrorBanner />
        <Header page={page} />
        <Filters />
        {children}
        <Panel />
        <Notifications />
      </main>
    </>
  );
}
