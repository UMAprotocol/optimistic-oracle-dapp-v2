import type { NextApiRequest, NextApiResponse } from "next";

import { constructVotingContract } from "./_common";

async function getVotingInfo() {
  const voting = await constructVotingContract();

  const [activeRequests, phase] = await Promise.all([
    voting.getPendingRequests(),
    voting.getVotePhase(),
  ]);

  return {
    activeRequests: activeRequests.length,
    phase: phase === 0 ? "commit" : "reveal",
  };
}

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse
) {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=43200"); // Cache for 12 hours, reset on re-deployment.

  try {
    const votingInfo = await getVotingInfo();
    response.status(200).send(votingInfo);
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Error in fetching voting information",
      error: e instanceof Error ? e.message : e,
    });
  }
}
