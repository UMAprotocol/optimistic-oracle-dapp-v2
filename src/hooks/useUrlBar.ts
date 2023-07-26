import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { usePageContext, usePanelContext } from "./contexts";
import { useQueries } from "./queries";

export function useUrlBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { all: queries } = useQueries();
  const { page } = usePageContext();
  const { panelOpen, openPanel, setQueryId } = usePanelContext();

  const addSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.append(name, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const addSearchParams = useCallback(
    (params: Record<string, string>) => {
      const urlSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        urlSearchParams.set(key, value);
      }

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const removeSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      for (const [_name, _value] of searchParams!) {
        if (_name === name && _value === value) continue;
        params.append(_name, _value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const removeSearchParams = useCallback(
    (...params: string[]) => {
      const urlSearchParams = new URLSearchParams(searchParams?.toString());

      for (const param of params) {
        urlSearchParams.delete(param);
      }

      router.push(`${pathname}?${urlSearchParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return useMemo(
    () => ({
      searchParams,
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
    }),
    [
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
      searchParams,
    ],
  );
}
