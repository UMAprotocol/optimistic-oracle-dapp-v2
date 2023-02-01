import { OracleQuery } from "@/types";
import { createContext, ReactNode, useState } from "react";

export interface PanelContextState {
  content: OracleQuery | undefined;
  setContent: (content: OracleQuery) => void;
  panelOpen: boolean;
  openPanel: (content: OracleQuery) => void;
  closePanel: () => void;
}

export const defaultPanelContextState = {
  content: undefined,
  setContent: () => undefined,
  panelOpen: false,
  openPanel: () => undefined,
  closePanel: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<OracleQuery | undefined>(undefined);
  const [panelOpen, setPanelOpen] = useState(false);

  function openPanel(content: OracleQuery) {
    setContent(content);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  return (
    <PanelContext.Provider
      value={{
        content,
        setContent,
        panelOpen,
        openPanel,
        closePanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
