import {
  ErrorContext,
  FilterAndSearchContext,
  NotificationsContext,
  OracleDataContext,
  PageContext,
  PanelContext,
  UrlBarContext,
} from "@/contexts";
import { useContext } from "react";

export const usePanelContext = () => useContext(PanelContext);
export const useErrorContext = () => useContext(ErrorContext);
export const useOracleDataContext = () => useContext(OracleDataContext);
export const useNotificationsContext = () => useContext(NotificationsContext);
export const useFilterAndSearchContext = () =>
  useContext(FilterAndSearchContext);
export const usePageContext = () => useContext(PageContext);
export const useUrlBarContext = () => useContext(UrlBarContext);
