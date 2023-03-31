import type { PageName } from "@shared/types";
import { useEffect } from "react";
import { usePageContext } from "./contexts";

export function usePage(page: PageName) {
  const { setPage } = usePageContext();

  useEffect(() => {
    setPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
