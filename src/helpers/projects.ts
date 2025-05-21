import type { Address } from "wagmi";

export type Project = {
  name: string;
  identifiers?: readonly string[]; // if listed then a request's identifier must be in this list for a match
  requesters?: readonly Address[];
  requiredTokens?: readonly string[]; // Tokens that must appear in ancillary data
};

// Central validation function to check if a request matches a project
export function validateProject(
  project: Project,
  params: Partial<{
    requester: string;
    decodedIdentifier: string;
    decodedAncillaryData: string;
  }>,
): boolean {
  const { requester, decodedIdentifier, decodedAncillaryData } = params;

  // can't validate
  if (!requester && !decodedIdentifier && !decodedAncillaryData) {
    return false;
  }
  // can't validate
  if (
    !project?.requesters?.length &&
    !project.requiredTokens &&
    !project?.identifiers?.length
  ) {
    return false;
  }

  // Check if requester matches (if defined)
  if (project?.requesters?.length && requester) {
    const matchesRequester = project.requesters.some(
      (addr) => addr.toLowerCase() === requester.toLowerCase(),
    );
    if (!matchesRequester) return false;
  }

  // Check if identifier matches (if defined)
  if (
    project.identifiers &&
    project.identifiers.length > 0 &&
    decodedIdentifier
  ) {
    const matchesIdentifier = project.identifiers.includes(decodedIdentifier);
    if (!matchesIdentifier) return false;
  }

  // Check if required tokens are present in ancillary data
  if (
    project.requiredTokens &&
    project.requiredTokens.length > 0 &&
    decodedAncillaryData
  ) {
    const hasAllRequiredTokens = project.requiredTokens.every((token) =>
      decodedAncillaryData.includes(token),
    );
    if (!hasAllRequiredTokens) return false;
  }

  return true;
}

export const projects = {
  across: {
    name: "Across",
    identifiers: ["ACROSS-V2"],
  },
  cozyFinance: {
    name: "Cozy Finance",
    requiredTokens: ["This will revert if a non-YES answer is proposed."],
  },
  infiniteGames: {
    name: "Infinite Games",
    requesters: [
      "0x8edec74d4e93b69bb8b1d9ba888d498a58846cb5",
      "0x4cb80ebdcabc9420edd4b5a5b296bbc86848206d",
    ],
    identifiers: ["MULTIPLE_CHOICE_QUERY"],
  },
  oSnap: {
    name: "OSnap",
    identifiers: ["MULTIPLE_CHOICE_QUERY"],
  },
  polyBet: {
    name: "PolyBet",
    identifiers: ["YES_OR_NO_QUERY"],
    requesters: [
      "0x7dbb803aeb717ae9b0420c30669e128d6aa2e304",
      "0xef888bc2bbe8e4858373cdd5edbff663aa194105",
    ],
    requiredTokens: ["res_data:"],
  },
  polymarket: {
    name: "Polymarket",
    identifiers: ["YES_OR_NO_QUERY", "MULTIPLE_VALUES"],
    requesters: [
      "0xcb1822859cef82cd2eb4e6276c7916e692995130",
      "0x6a9d222616c90fca5754cd1333cfd9b7fb6a4f74",
      "0x2f5e3684cb1f318ec51b00edba38d79ac2c0aa9d",
      "0x4bfb41d5b3570defd03c39a9a4d8de6bd8b8982e",
      "0xb21182d0494521cf45dbbeebb5a3acaab6d22093",
    ],
  },
  predictFun: {
    name: "Predict.Fun",
    requesters: [
      "0x0c1331e4a4bbd59b7aae2902290506bf8fbe3e6c",
      "0xb0c308abec5d321a7b6a8e3ce43a368276178f7a",
    ],
    identifiers: ["YES_OR_NO_QUERY"],
    requiredTokens: ["res_data:", "q: title:"],
  },
  prognoze: {
    name: "Prognoze",
    requesters: ["0x437d2ed00c7d6d6c8401c7b810b51b422593c22b"],
    identifiers: ["MULTIPLE_CHOICE_QUERY"],
  },
  rated: {
    name: "Rated",
    identifiers: ["ROPU_ETHx"],
  },
  sherlock: {
    name: "Sherlock",
    identifiers: ["SHERLOCK_CLAIM"],
  },
  unknown: {
    name: "Unknown",
  },
} as const satisfies Record<string, Project>;
export const projectNames = Object.values(projects).map((p) => p.name);
export type ProjectName = (typeof projectNames)[number];
