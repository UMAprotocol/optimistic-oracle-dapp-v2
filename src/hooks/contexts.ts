import {
  ErrorContext,
  PanelContext,
  OracleDataContext,
  NotificationsContext,
} from "@/contexts";
import { useContext } from "react";

export const usePanelContext = () => useContext(PanelContext);
export const useErrorContext = () => useContext(ErrorContext);
export const useOracleDataContext = () => useContext(OracleDataContext);
export const useNotificationsContext = () => useContext(NotificationsContext);
