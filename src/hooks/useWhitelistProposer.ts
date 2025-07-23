import { getProvider } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import { getContractAddress } from "@libs/constants";
import {
  OptimisticOracleV2Ethers__factory,
  type OptimisticOracleV2Ethers,
} from "@uma/contracts-frontend";
import assert from "assert";
import type { BytesLike } from "ethers";
import { useAccount, useQuery } from "wagmi";

export type ProposerWhitelistWithEnforcementStatus = {
  allowedProposers: string[];
  isEnforced: boolean;
};

// TODO: replace this stub when @uma/contracts-frontend is updated
type ManagedOptimisticOracleV2 = OptimisticOracleV2Ethers & {
  getProposerWhitelistWithEnforcementStatus: (
    requester: string,
    identifier: BytesLike,
    ancillaryData: BytesLike,
  ) => Promise<ProposerWhitelistWithEnforcementStatus>;
};

async function getProposerWhitelistWithEnforcementStatus(
  query: OracleQueryUI,
): Promise<ProposerWhitelistWithEnforcementStatus> {
  try {
    const { requester, identifier, queryTextHex: ancillaryData } = query;
    assert(requester, "requester missing from query object");
    assert(identifier, "identifier missing from query object");
    assert(ancillaryData, "ancillaryData missing from query object");

    const contractAddress = getContractAddress({
      chainId: query.chainId,
      type: "Managed Optimistic Oracle V2",
    });

    if (!contractAddress)
      throw Error("Unable to resolve address for Managed Optimistic Oracle V2");
    const contract = OptimisticOracleV2Ethers__factory.connect(
      contractAddress,
      getProvider(query.chainId),
    ) as ManagedOptimisticOracleV2;

    return await contract.getProposerWhitelistWithEnforcementStatus(
      requester,
      identifier,
      ancillaryData,
    );
  } catch (e) {
    // TODO: handle errors, add retry logic?
    console.error(e);
    throw e;
  }
}

type QueryOptions = Omit<Parameters<typeof useQuery>[1], "queryFn">;

export function useProposerWhitelist(
  query: OracleQueryUI | undefined,
  queryOptions?: QueryOptions,
) {
  return useQuery(["getProposerWhitelistWithEnforcementStatus", query?.id], {
    queryFn: () => {
      if (!query) return undefined;
      return getProposerWhitelistWithEnforcementStatus(query);
    },
    refetchInterval: 30_000, // 30 seconds
    enabled: Boolean(query),
    onError(err) {
      console.error({
        error: err,
        at: "useProposerWhitelist",
      });
    },
    ...queryOptions,
  });
}

export function useIsUserWhitelisted(
  query: OracleQueryUI | undefined,
  queryOptions?: QueryOptions,
) {
  const { data } = useProposerWhitelist(query, {
    enabled: Boolean(
      query && query.oracleType !== "Managed Optimistic Oracle V2",
    ),
  });
  const { address } = useAccount();
  return useQuery(["useIsUserWhitelisted", address, query?.id], {
    queryFn: () => {
      if (!query) return false;
      if (query.oracleType !== "Managed Optimistic Oracle V2") return true;
      if (!data || !address) {
        return false;
      }
      if (!data.isEnforced) return true;
      return data.allowedProposers.includes(address);
    },
    refetchInterval: 30_000, // 30 seconds
    enabled: Boolean(query),
    onError(err) {
      console.error({
        error: err,
        at: "useIsUserWhitelisted",
      });
    },
    ...queryOptions,
  });
}
