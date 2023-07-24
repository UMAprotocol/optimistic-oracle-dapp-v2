import { useHandleQueryInUrl } from "@/hooks";
import type { ChainId, OracleType } from "@shared/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { createContext, useCallback } from "react";

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
  removeSearchParam: (name: string) => void;
};

export const defaultUrlBarContextState: UrlBarContextState = {
  addSearchParam: () => undefined,
  removeSearchParam: () => undefined,
};

export const UrlBarContext = createContext(defaultUrlBarContextState);

export function UrlBarProvider({ children }: { children: ReactNode }) {
  useHandleQueryInUrl();
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

  const removeSearchParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete(name);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <UrlBarContext.Provider
      value={{
        addSearchParam,
        removeSearchParam,
      }}
    >
      {children}
    </UrlBarContext.Provider>
  );
}
