import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface PanelContextState {
  id: string | undefined;
  panelOpen: boolean;
  openPanel: (id: string, isFromUserInteraction?: boolean) => void;
  closePanel: () => void;
  setPanelOpen: (panelOpen: boolean) => void;
  setId: (id: string | undefined) => void;
}

export const defaultPanelContextState = {
  panelOpen: false,
  id: undefined,
  openPanel: () => undefined,
  closePanel: () => undefined,
  setPanelOpen: () => undefined,
  setId: () => undefined,
};

export const PanelContext = createContext<PanelContextState>(
  defaultPanelContextState
);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);

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
  }, []);

  const openPanel = useCallback((id: string) => {
    setId(id);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      id,
      setId,
      panelOpen,
      openPanel,
      setPanelOpen,
      closePanel,
    }),
    [closePanel, id, openPanel, panelOpen]
  );

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
}
