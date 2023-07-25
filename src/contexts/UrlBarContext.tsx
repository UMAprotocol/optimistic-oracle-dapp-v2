import type { ChainId, OracleType } from "@shared/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useCallback, useMemo } from "react";

type HashAndIndexParams = {
  transactionHash?: string;
  eventIndex?: string;
};

type OldOracleTypeName = "Optimistic" | "OptimisticV2" | "Skinny";

type RequestDetailsParams = {
  chainId?: ChainId;
  oracleType?: OldOracleTypeName;
  requester?: string;
  timestamp?: string;
  identifier?: string;
  ancillaryData?: string;
};

type SearchParams = HashAndIndexParams & RequestDetailsParams;

function getOracleTypeFromOldOracleName(
  oracleType: OldOracleTypeName,
): OracleType {
  switch (oracleType) {
    case "Optimistic":
      return "Optimistic Oracle V1";
    case "OptimisticV2":
      return "Optimistic Oracle V2";
    case "Skinny":
      return "Skinny Optimistic Oracle";
  }
}

export type UrlBarContextState = {
  addSearchParam: (name: string, value: string) => void;
  addSearchParams: (params: Record<string, string>) => void;
  removeSearchParam: (name: string) => void;
  removeSearchParams: (...params: string[]) => void;
};

export const defaultUrlBarContextState: UrlBarContextState = {
  addSearchParam: () => undefined,
  addSearchParams: () => undefined,
  removeSearchParam: () => undefined,
  removeSearchParams: () => undefined,
};

export const UrlBarContext = createContext(defaultUrlBarContextState);

export function UrlBarProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const addSearchParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);
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
    (name: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete(name);
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

  const value = useMemo(
    () => ({
      addSearchParam,
      addSearchParams,
      removeSearchParam,
      removeSearchParams,
    }),
    [addSearchParam, addSearchParams, removeSearchParam, removeSearchParams],
  );

  return (
    <UrlBarContext.Provider value={value}>{children}</UrlBarContext.Provider>
  );
}
