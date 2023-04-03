import type { VotingInfo } from "@/types";
import useSWR from "swr";

async function getVotingInfo() {
  const response = await fetch("/api/get-voting-info");
  return (await response.json()) as VotingInfo;
}

export function useVotingInfo() {
  return useSWR("/api/get-voting-info", getVotingInfo);
}
