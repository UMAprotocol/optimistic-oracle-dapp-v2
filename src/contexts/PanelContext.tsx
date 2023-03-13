import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import type { ReactNode } from "react";
import { createContext, useState } from "react";

export interface PanelContextState {
  panelOpen: boolean;
  page: PageName | undefined;
  content: OracleQueryUI | undefined;
  openPanel: (content: OracleQueryUI, page: PageName) => void;
  closePanel: () => void;
}

export const defaultPanelContextState = {
  panelOpen: false,
  page: undefined,
  content: undefined,
  openPanel: () => undefined,
  closePanel: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<OracleQueryUI | undefined>();
  const [page, setPage] = useState<PageName | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);

  function openPanel(content: OracleQueryUI, page: PageName) {
    setPage(page);
    setContent(content);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  return (
    <PanelContext.Provider
      value={{
        page,
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
