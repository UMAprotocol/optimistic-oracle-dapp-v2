import { makeUrlParamsForQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { useOracleDataContext } from "@/hooks";

export interface PanelContextState {
  panelOpen: boolean;
  content: OracleQueryUI | undefined;
  openPanel: (
    content: OracleQueryUI,
    isFromUserInteraction?: boolean
  ) => Promise<void>;
  closePanel: () => Promise<void>;
}

export const defaultPanelContextState = {
  panelOpen: false,
  content: undefined,
  openPanel: () => Promise.resolve(),
  closePanel: () => Promise.resolve(),
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const { all } = useOracleDataContext();
  const [id, setId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const router = useRouter();

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

  async function openPanel(
    content: OracleQueryUI,
    isFromUserInteraction = true
  ) {
    if (isFromUserInteraction) {
      const query = makeUrlParamsForQuery(content);

      await router.push({ query });
    }

    setId(content.id);
    setPanelOpen(true);
  }
  const content: OracleQueryUI | undefined =
    all !== undefined && id !== undefined ? all[id] : undefined;

  async function closePanel() {
    await router.push({ query: {} });
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
