export interface VotingInfo {
  apy: string;
  activeRequests: number;
  phase: "commit" | "reveal";
}
