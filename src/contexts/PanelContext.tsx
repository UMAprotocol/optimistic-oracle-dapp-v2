import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { createContext, useState } from "react";

export interface PanelContextState {
  panelOpen: boolean;
  page: PageName | undefined;
  content: OracleQueryUI | undefined;
  openPanel: (
    content: OracleQueryUI,
    page: PageName,
    isFromUserInteraction?: boolean
  ) => void;
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
  const router = useRouter();

  function openPanel(
    content: OracleQueryUI,
    page: PageName,
    isFromUserInteraction = true
  ) {
    if (isFromUserInteraction) {
      const { requestHash, requestLogIndex, assertionHash, assertionLogIndex } =
        content;
      const isRequest = !!requestHash && !!requestLogIndex;
      const isAssertion = !!assertionHash && !!assertionLogIndex;
      const query = isRequest
        ? {
            requestHash,
            requestLogIndex,
          }
        : isAssertion
        ? {
            assertionHash,
            assertionLogIndex,
          }
        : {};

      router.push({ query }).catch(console.error);
    }

    setPage(page);
    setContent(content);
    setPanelOpen(true);
  }

  function closePanel() {
    router.push({ query: {} }).catch(console.error);
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
