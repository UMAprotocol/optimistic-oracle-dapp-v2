"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface PanelContextState {
  panelOpen: boolean;
  queryId: string | undefined;
  setQueryId: (queryId: string | undefined) => void;
  openPanel: (queryId?: string) => void;
  closePanel: () => void;
}

export const defaultPanelContextState = {
  panelOpen: false,
  queryId: undefined,
  setQueryId: () => undefined,
  openPanel: () => undefined,
  closePanel: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState,
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [queryId, setQueryId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    function onPopState() {
      if (!searchParams) {
        setPanelOpen(false);
      }
    }

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [searchParams]);

  const openPanel = useCallback((queryId?: string) => {
    setQueryId(queryId);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      queryId,
      panelOpen,
      setQueryId,
      openPanel,
      closePanel,
    }),
    [closePanel, openPanel, panelOpen, queryId],
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}
