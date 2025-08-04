import { getProvider, isAddress, utf8ToHex } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import type { ManagedOptimisticOracleV2 } from "@/types/contracts/ManagedOptimisticOracleV2";
import { getContractAddress } from "@libs/constants";
import { getProposerWhitelistWithEnabledStatusAbi } from "@shared/constants/abi";
import assert from "assert";
import { Contract } from "ethers";
import { hexZeroPad, isBytesLike } from "ethers/lib/utils";
import { useAccount, useQuery } from "wagmi";

export type ProposerWhitelistWithEnforcementStatus = Awaited<
  ReturnType<ManagedOptimisticOracleV2["getProposerWhitelistWithEnabledStatus"]>
>;

async function getProposerWhitelistWithEnabledStatus(
  query: OracleQueryUI,
): Promise<ProposerWhitelistWithEnforcementStatus> {
  try {
    const { requester, identifier, queryTextHex: ancillaryData } = query;
    // identifier is decoded at this point
    const identifierHex = identifier
      ? hexZeroPad(utf8ToHex(identifier), 32)
      : undefined;

    // check inputs
    assert(requester && isAddress(requester), "Invalid requester");
    assert(identifierHex && isBytesLike(identifierHex), "Invalid identifier");
    assert(
      ancillaryData && isBytesLike(ancillaryData),
      "Invalid ancillaryData",
    );

    const contractAddress = getContractAddress({
      chainId: query.chainId,
      type: "Managed Optimistic Oracle V2",
    });

    if (!contractAddress)
      throw Error("Unable to resolve address for Managed Optimistic Oracle V2");

    const contract = new Contract(
      contractAddress,
      getProposerWhitelistWithEnabledStatusAbi,
      getProvider(query.chainId),
    ) as ManagedOptimisticOracleV2;

    return await contract.getProposerWhitelistWithEnabledStatus(
      requester,
      identifierHex,
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
  return useQuery(
    ["getProposerWhitelistWithEnabledStatus", query?.id, query?.oracleType],
    {
      queryFn: () => {
        if (!query) return undefined;
        return getProposerWhitelistWithEnabledStatus(query);
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
    },
  );
}

export function useIsUserWhitelisted(
  query: OracleQueryUI | undefined,
  queryOptions?: QueryOptions,
) {
  const { address } = useAccount();
  return useQuery(
    ["useIsUserWhitelisted", address, query?.id, query?.oracleType],
    {
      queryFn: async () => {
        if (!query || !query.oracleType) return false;
        if (query.oracleType !== "Managed Optimistic Oracle V2") return true;
        if (!address) {
          return false;
        }
        const data = await getProposerWhitelistWithEnabledStatus(query);
        if (!data.isEnforced) return true;
        return data.allowedProposers
          .map((a) => a.toLowerCase())
          .includes(address.toLowerCase());
      },
      refetchInterval: 30_000, // 30 seconds
      enabled: Boolean(query?.id && address && query.oracleType),
      onError(err) {
        console.error({
          error: err,
          at: "useIsUserWhitelisted",
        });
      },
      ...queryOptions,
    },
  );
}
