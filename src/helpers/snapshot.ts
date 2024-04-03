import type { OsnapPluginData } from "@/types";
import { isOsnapProposalPluginData, type SnapshotData } from "@/types";
import assert from "assert";
import useSWR from "swr";

async function getIpfs(hash?: string) {
  if (!hash) return undefined;
  // could also use ipfs.io/ipfs, but this may be more reliable
  const response = await fetch(`https://snapshot.4everland.link/ipfs/${hash}`);
  return await response.json();
}

export function useIpfsProposalData(queryText: string | undefined) {
  const explanationRegex = queryText
    ? queryText.match(/explanation:"(.*?)",rules:/)
    : undefined;
  return useIpfs(explanationRegex ? explanationRegex[1] : undefined);
}

export function useSnapPluginData(queryText: string | undefined) {
  const ipfsProposalData = useIpfsProposalData(queryText);
  if (ipfsProposalData?.data) {
    return getOsnapProposalPluginData(ipfsProposalData.data);
  }
}
export function useIpfs(hash?: string) {
  return useSWR(hash ? `/ipfs/${hash}` : null, () => {
    assert(hash, "Missing ipfs hash");
    return getIpfs(hash);
  });
}

export function snapshotProposalLink(ipfsData: unknown) {
  // casting this to expected snapshot type
  const snapshotData = ipfsData as SnapshotData;
  const title = snapshotData?.data?.message?.title;
  const space = snapshotData?.data?.message?.space;
  const hash = snapshotData?.hash;

  if (space && hash) {
    return {
      link: `http://localhost:8080/#/${space}/proposal/${hash}`,
      title: title ?? space,
    };
  }
}

export function getOsnapProposalPluginData(
  ipfsData: unknown,
): OsnapPluginData | null {
  const pluginsData = (ipfsData as SnapshotData)?.data?.message?.plugins;
  if (!pluginsData) return null;
  const parsed = JSON.parse(pluginsData);
  const isOsnapProposal = isOsnapProposalPluginData(parsed);
  if (!isOsnapProposal) return null;
  return parsed;
}
