import type { DropdownItem } from "@/types";
import type { Address } from "wagmi";
import { maybeMakePolymarketOptions } from "./polymarket";
import { maybeMakePolybetOptions } from "./polybet";

export type Project = {
  name: string;
  makeProposeOptions?: (
    decodedAncillaryData: string,
    decodedIdentifier: string,
  ) => DropdownItem[] | undefined;
  identifiers?: readonly string[]; // if listed then a request's identifier must be in this list for a match
  privateIdentifiers?: readonly string[]; // identifiers that are specific to this project; if a request uses one of these, it's always this project
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

  // First check if this identifier is in the project's privateIdentifiers list
  if (
    project.privateIdentifiers?.length &&
    decodedIdentifier &&
    project.privateIdentifiers.includes(decodedIdentifier)
  ) {
    return true;
  }

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
    privateIdentifiers: ["ACROSS-V2"],
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
  metaMarket: {
    name: "MetaMarket",
    requesters: ["0x46500F8BfF8B8DEE2DA41e8960681C792270e10c"],
    identifiers: ["YES_OR_NO_QUERY"],
    makeProposeOptions(decodedAncillaryData, decodedIdentifier) {
      switch (decodedIdentifier) {
        case "YES_OR_NO_QUERY":
          return maybeMakePolymarketOptions(decodedAncillaryData);
        default:
          undefined;
      }
    },
  },
  oSnap: {
    name: "OSnap",
    identifiers: ["MULTIPLE_CHOICE_QUERY"],
    requiredTokens: ["rules:", "explanation:"],
  },
  polyBet: {
    name: "PolyBet",
    identifiers: ["YES_OR_NO_QUERY"],
    requesters: [
      "0x7dbb803aeb717ae9b0420c30669e128d6aa2e304",
      "0xef888bc2bbe8e4858373cdd5edbff663aa194105",
    ],
    requiredTokens: ["res_data:"],
    makeProposeOptions(decodedAncillaryData, decodedIdentifier) {
      switch (decodedIdentifier) {
        case "YES_OR_NO_QUERY":
          return maybeMakePolybetOptions(decodedAncillaryData);
        default:
          undefined;
      }
    },
  },
  polymarket: {
    name: "Polymarket",
    identifiers: ["YES_OR_NO_QUERY", "MULTIPLE_VALUES"],
    // https://github.com/UMAprotocol/protocol/blob/master/packages/monitor-v2/src/monitor-polymarket/common.ts#L474
    requesters: [
      "0xcb1822859cef82cd2eb4e6276c7916e692995130", // Polymarket Binary Adapter Address
      "0x6a9d222616c90fca5754cd1333cfd9b7fb6a4f74", // Polymarket CTF Adapter Address
      "0x2f5e3684cb1f318ec51b00edba38d79ac2c0aa9d", // Polymarket CTF Adapter Address V2
      "0x4bfb41d5b3570defd03c39a9a4d8de6bd8b8982e", // Polymarket CTF Exchange Address
      "0xb21182d0494521cf45dbbeebb5a3acaab6d22093", // Polymarket Sports Address
    ],
    makeProposeOptions(decodedAncillaryData, decodedIdentifier) {
      switch (decodedIdentifier) {
        case "YES_OR_NO_QUERY":
          return maybeMakePolymarketOptions(decodedAncillaryData);
        default:
          undefined;
      }
    },
  },
  predictFun: {
    name: "Predict.Fun",
    requesters: [
      "0x0c1331e4a4bbd59b7aae2902290506bf8fbe3e6c",
      "0xb0c308abec5d321a7b6a8e3ce43a368276178f7a",
    ],
    identifiers: ["YES_OR_NO_QUERY"],
    requiredTokens: ["res_data:", "q: title:"],
    makeProposeOptions(decodedAncillaryData, decodedIdentifier) {
      switch (decodedIdentifier) {
        case "YES_OR_NO_QUERY":
          return maybeMakePolymarketOptions(decodedAncillaryData);
        default:
          undefined;
      }
    },
  },
  prognoze: {
    name: "Prognoze",
    requesters: ["0x437d2ed00c7d6d6c8401c7b810b51b422593c22b"],
    identifiers: ["MULTIPLE_CHOICE_QUERY"],
  },
  rated: {
    name: "Rated",
    privateIdentifiers: ["ROPU_ETHx"],
  },
  sherlock: {
    name: "Sherlock",
    privateIdentifiers: ["SHERLOCK_CLAIM"],
  },
  unknown: {
    name: "Unknown",
  },
} as const satisfies Record<string, Project>;
export const projectNames = Object.values(projects).map((p) => p.name);
export type ProjectName = (typeof projectNames)[number];
