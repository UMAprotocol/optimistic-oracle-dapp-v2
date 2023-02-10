import { ErrorContext, PanelContext } from "@/contexts";
import { useContext } from "react";

export const usePanelContext = () => useContext(PanelContext);

export const useErrorContext = () => useContext(ErrorContext);
