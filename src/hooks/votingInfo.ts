import { config } from "@/constants";
import type { VotingInfo } from "@/types";
import useSWR from "swr";

async function getVotingInfo() {
  const response = await fetch("/api/get-voting-info");
  return (await response.json()) as VotingInfo;
}

export function useVotingInfo() {
  const fallbackData = {
    apy: config.defaultApy,
    activeRequests: 0,
    phase: "commit" as const,
  };

  return useSWR("/api/get-voting-info", getVotingInfo, { fallbackData });
}
