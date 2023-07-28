"use client";

import { makeUrlParamsForQuery } from "@/helpers";
import { useQueryById } from "@/hooks";
import { useUrlBar } from "@/hooks/useUrlBar";
import type { OracleQueryUI } from "@/types";
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
  query: OracleQueryUI | undefined;
  setQueryId: (queryId: string | undefined) => void;
  openPanel: (queryId?: string) => void;
  closePanel: () => void;
}

export const defaultPanelContextState = {
  panelOpen: false,
  query: undefined,
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
  const { addSearchParams, removeSearchParams, searchParams } = useUrlBar();
  const query = useQueryById(queryId);

  const addHashAndIndexToUrl = useCallback(
    (query: OracleQueryUI) => {
      const searchParams = makeUrlParamsForQuery(query);
      addSearchParams(searchParams);
    },
    [addSearchParams],
  );

  const removeHashAndIndexFromUrl = useCallback(() => {
    removeSearchParams("transactionHash", "eventIndex");
  }, [removeSearchParams]);

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

  useEffect(() => {
    if (panelOpen && query) {
      addHashAndIndexToUrl(query);
    }
  }, [addHashAndIndexToUrl, panelOpen, query, removeHashAndIndexFromUrl]);

  const openPanel = useCallback((queryId?: string) => {
    setQueryId(queryId);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    removeHashAndIndexFromUrl();
  }, [removeHashAndIndexFromUrl]);

  const value = useMemo(
    () => ({
      query,
      panelOpen,
      setQueryId,
      openPanel,
      closePanel,
    }),
    [closePanel, openPanel, panelOpen, query],
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}
