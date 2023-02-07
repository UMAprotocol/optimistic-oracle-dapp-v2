import { PanelContent, Page } from "@/types";
import { createContext, ReactNode, useState } from "react";

export interface PanelContextState {
  panelOpen: boolean;
  page: Page | undefined;
  content: PanelContent | undefined;
  openPanel: (content: PanelContent, page: Page) => void;
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
  const [content, setContent] = useState<PanelContent | undefined>();
  const [page, setPage] = useState<Page | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);

  function openPanel(content: PanelContent, page: Page) {
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
