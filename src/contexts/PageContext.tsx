"use client";

import type { PageName } from "@shared/types";
import type { ReactNode } from "react";
import { createContext, useState } from "react";

export interface PageContextState {
  page: PageName;
  setPage: (page: PageName) => void;
}

export const defaultState: PageContextState = {
  page: "verify",
  setPage: () => null,
};

export const PageContext = createContext(defaultState);

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageName>("verify");

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  );
}
