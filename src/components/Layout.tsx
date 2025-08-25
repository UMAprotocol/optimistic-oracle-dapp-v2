"use client";

import { Filters, Header, Notifications, Panel } from "@/components";
import { usePageContext } from "@/hooks";
import { useQueryInSearchParams } from "@/hooks/useQueryInSearchParams";
import type { ReactNode } from "react";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
import { useFiltersInSearchParams } from "@/hooks/useFiltersInSearchParams";
import { Footer } from "./Footer";
import { Banners } from "./Banners";

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useQueryInSearchParams();
  useFiltersInSearchParams();

  return (
    <StyledComponentsRegistry>
      <main className="min-h-[100vh] flex flex-col">
        <Banners />
        <Header page={page} />
        <Filters />
        {children}
        <Panel />
        <Footer />
        <Notifications />
      </main>
    </StyledComponentsRegistry>
  );
}
