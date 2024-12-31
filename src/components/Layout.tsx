"use client";

import {
  ErrorBanner,
  Filters,
  Header,
  Notifications,
  Panel,
} from "@/components";
import { usePageContext } from "@/hooks";
import { useQueryInSearchParams } from "@/hooks/useQueryInSearchParams";
import type { ReactNode } from "react";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
import { useFiltersInSearchParams } from "@/hooks/useFiltersInSearchParams";

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useQueryInSearchParams();
  useFiltersInSearchParams();

  return (
    <StyledComponentsRegistry>
      <main>
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
