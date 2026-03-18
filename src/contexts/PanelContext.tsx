"use client";

import { makeUrlParamsForQuery } from "@/helpers";
import { useQueryById } from "@/hooks";
import { useUrlBar } from "@/hooks/useUrlBar";
import { DEEPLINK_PARAM_KEYS } from "@/helpers/deeplink";
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
  /** True when the panel was opened from a table row click (not a deeplink). */
  openedFromTable: boolean;
  setQueryId: (queryId: string | undefined) => void;
  openPanel: (queryId?: string) => void;
  openPanelWithQuery: (query: OracleQueryUI) => void;
  closePanel: () => void;
}

export const defaultPanelContextState: PanelContextState = {
  panelOpen: false,
  query: undefined,
  openedFromTable: false,
  setQueryId: () => undefined,
  openPanel: () => undefined,
  openPanelWithQuery: () => undefined,
  closePanel: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState,
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [queryId, setQueryId] = useState<string | undefined>();
  const [directQuery, setDirectQuery] = useState<OracleQueryUI | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const [openedFromTable, setOpenedFromTable] = useState(false);
  const { addSearchParams, removeSearchParams, searchParams } = useUrlBar();
  const queryFromTable = useQueryById(queryId);

  // Deeplink query takes precedence over table lookup
  const query = directQuery ?? queryFromTable;

  const setUrlParamsForQuery = useCallback(
    (query: OracleQueryUI) => {
      const params = makeUrlParamsForQuery(query);
      if (!params.transactionHash) return;
      addSearchParams(params);
    },
    [addSearchParams],
  );

  const removeDeeplinkParamsFromUrl = useCallback(() => {
    removeSearchParams(...DEEPLINK_PARAM_KEYS);
  }, [removeSearchParams]);

  // Handle browser back button
  useEffect(() => {
    function onPopState() {
      if (!searchParams?.has("transactionHash")) {
        setPanelOpen(false);
        setDirectQuery(undefined);
        setOpenedFromTable(false);
      }
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [searchParams]);

  // Sync URL when panel opens with table query
  useEffect(() => {
    if (panelOpen && queryFromTable && !directQuery) {
      setUrlParamsForQuery(queryFromTable);
    }
  }, [panelOpen, queryFromTable, directQuery, setUrlParamsForQuery]);

  const openPanel = useCallback((queryId?: string) => {
    setDirectQuery(undefined);
    setOpenedFromTable(true);
    setQueryId(queryId);
    setPanelOpen(true);
  }, []);

  const openPanelWithQuery = useCallback((query: OracleQueryUI) => {
    setDirectQuery(query);
    setOpenedFromTable(false);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setDirectQuery(undefined);
    setOpenedFromTable(false);
    removeDeeplinkParamsFromUrl();
  }, [removeDeeplinkParamsFromUrl]);

  const value = useMemo(
    () => ({
      query,
      panelOpen,
      openedFromTable,
      setQueryId,
      openPanel,
      openPanelWithQuery,
      closePanel,
    }),
    [
      closePanel,
      openPanel,
      openPanelWithQuery,
      openedFromTable,
      panelOpen,
      query,
    ],
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}
