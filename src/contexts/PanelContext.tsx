"use client";

import { makeQueryString, makeUrlParamsForQuery } from "@/helpers";
import { useOracleDataContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

export interface PanelContextState {
  panelOpen: boolean;
  content: OracleQueryUI | undefined;
  openPanel: (content: OracleQueryUI, isFromUserInteraction?: boolean) => void;
  closePanel: () => void;
}

export const defaultPanelContextState = {
  panelOpen: false,
  content: undefined,
  openPanel: () => undefined,
  closePanel: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState,
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const { all } = useOracleDataContext();
  const [id, setId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    function onPopState() {
      if (!window.location.search) {
        setPanelOpen(false);
      }
    }

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openPanel(content: OracleQueryUI, isFromUserInteraction = true) {
    if (isFromUserInteraction) {
      const query = makeUrlParamsForQuery(content);

      router.push(makeQueryString(query, pathname, searchParams));
    }

    setId(content.id);
    setPanelOpen(true);
  }
  const content: OracleQueryUI | undefined =
    all !== undefined && id !== undefined ? all[id] : undefined;

  function closePanel() {
    router.push(pathname ?? "/");
    setPanelOpen(false);
  }

  return (
    <PanelContext.Provider
      value={{
        content,
        panelOpen,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
