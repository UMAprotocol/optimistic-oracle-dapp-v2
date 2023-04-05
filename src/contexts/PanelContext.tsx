import { makeUrlParamsForQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";

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
  const [content, setContent] = useState<OracleQueryUI | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

  async function openPanel(
    content: OracleQueryUI,
    isFromUserInteraction = true
  ) {
    if (isFromUserInteraction) {
      const query = makeUrlParamsForQuery(content);

      await router.push({ query });
    }

    setContent(content);
    setPanelOpen(true);
  }

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
