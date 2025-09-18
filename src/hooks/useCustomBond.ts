import { config } from "@/constants";
import { getCustomBondForRequest } from "@libs/oracle-sdk-v2/services/managedv2/gql/queries";
import type { OracleQueryUI } from "@/types";
import type { SubgraphConfig } from "@/constants/env";
import { useQuery } from "wagmi";
import type { Address } from "wagmi";

export type useCustomBondParams = {
  query?: OracleQueryUI;
  enabled?: boolean;
};

export type CustomBondData = {
  bond: bigint;
  currency: Address;
};

export type CustomBondResult = {
  data: CustomBondData | null;
  isResolved: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasCustomBond: boolean;
};

// Managed OO requesters may change the bond AFTER request time, but BEFORE a proposal has been made.
// Since priceRequest entity in the subgraph cannot be updated from setCustomBond events, we need to check again in the UI
export function useCustomBond({
  query,
  enabled = true,
}: useCustomBondParams): CustomBondResult {
  const shouldFetch =
    query?.oracleType === "Managed Optimistic Oracle V2" &&
    query?.actionType === "propose" &&
    enabled;

  // Get the subgraph URL for this chain/oracle
  const subgraphUrl = config.subgraphs.find(
    (subgraph: SubgraphConfig) =>
      subgraph.chainId === query?.chainId &&
      subgraph.type === "Managed Optimistic Oracle V2",
  )?.urls?.[0];

  const queryResult = useQuery(
    [
      "customBond",
      subgraphUrl,
      query?.requester,
      query?.identifier,
      query?.queryTextHex,
    ],
    {
      queryFn: async (): Promise<CustomBondData | null> => {
        if (
          subgraphUrl &&
          query?.requester &&
          query?.identifier &&
          query?.queryTextHex
        ) {
          const result = await getCustomBondForRequest(
            subgraphUrl,
            query?.requester,
            query?.identifier,
            query?.queryTextHex,
          );
          if (result) {
            return {
              bond: BigInt(result.customBond),
              currency: result.currency,
            };
          }
        }
        // Return null if no custom bond found (this is a successful result, not an error)
        return null;
      },
      enabled: Boolean(
        shouldFetch &&
          subgraphUrl &&
          query?.requester &&
          query?.identifier &&
          query?.queryTextHex,
      ),
      retry: 3,
    },
  );

  return {
    data: queryResult.data
      ? {
          bond: queryResult.data.bond + (query?.finalFee ?? 0n), // add final fee to total bond
          currency: queryResult.data.currency,
        }
      : null,
    isResolved: queryResult.isSuccess, // Successfully fetched (whether data found or not)
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error as Error | null,
    hasCustomBond: Boolean(queryResult.data), // True if custom bond was found
  };
}
