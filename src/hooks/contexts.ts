import { ErrorContext, PanelContext, OracleDataContext } from "@/contexts";
import { useContext } from "react";

export const usePanelContext = () => useContext(PanelContext);
export const useErrorContext = () => useContext(ErrorContext);
export const useOracleDataContext = () => useContext(OracleDataContext);
