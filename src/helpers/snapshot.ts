import type { PluginTypes } from "@/types";
import {
  isOsnapProposalPluginData,
  isSafeSnapProposalPluginData,
  type SnapshotData,
} from "@/types";
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

export function useOsnapPluginData(queryText: string | undefined): PluginTypes {
  const ipfsProposalData = useIpfsProposalData(queryText);
  if (ipfsProposalData?.data) {
    return parsePluginData(ipfsProposalData.data);
  }
  return null;
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
      link: `https://snapshot.org/#/${space}/proposal/${hash}`,
      title: title ?? space,
    };
  }
}

export function parsePluginData(ipfsData: unknown): PluginTypes {
  const pluginsData = (ipfsData as SnapshotData)?.data?.message?.plugins;
  if (!pluginsData) return null;
  const parsed = JSON.parse(pluginsData);

  if (isOsnapProposalPluginData(parsed)) {
    return parsed.oSnap;
  }
  if (isSafeSnapProposalPluginData(parsed)) {
    return "safeSnap";
  }
  return null;
}
