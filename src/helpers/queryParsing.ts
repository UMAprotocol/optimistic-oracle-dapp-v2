import approvedIdentifiers from "@/data/approvedIdentifiersTable";
import type { MetaData } from "@/types";

export function checkIfIsCozy(decodedAncillaryData: string) {
  const cozyToken = "This will revert if a non-YES answer is proposed.";
  if (decodedAncillaryData.includes(cozyToken)) {
    return true;
  }
  return false;
}

export function checkIfIsPolymarket(
  decodedIdentifier: string,
  decodedAncillaryData: string
) {
  const queryTitleToken = "q: title:";
  const resultDataToken = "res_data:";
  const isPolymarket =
    decodedIdentifier === "YES_OR_NO_QUERY" &&
    decodedAncillaryData.includes(queryTitleToken) &&
    decodedAncillaryData.includes(resultDataToken);

  return isPolymarket;
}

export function getQueryMetaData(
  decodedIdentifier: string,
  decodedQueryText: string
): MetaData {
  const isAcross = decodedIdentifier === "ACROSS-V2";
  if (isAcross) {
    const title = "Across V2 Request";
    const description = `Across is an optimistic insured bridge that relies on a decentralized group of relayers to fulfill user deposit requests from EVM to EVM networks. Relayer funds are insured by liquidity providers in a single pool on Ethereum and refunds are processed via the UMA Optimistic Oracle. [Learn more.](https://docs.across.to/)`;
    const umipUrl =
      "https://github.com/UMAprotocol/UMIPs/blob/448375e1b9d2bd24dfd0627805ef6a7c2d72f74f/UMIPs/umip-157.md";
    const umipNumber = "umip-157";

    return {
      title,
      description,
      umipUrl,
      umipNumber,
      project: "Across",
    };
  }

  const isPolymarket = checkIfIsPolymarket(decodedIdentifier, decodedQueryText);
  if (isPolymarket) {
    const ancillaryDataTitle = getTitleFromAncillaryData(decodedQueryText);
    const ancillaryDataDescription =
      getDescriptionFromAncillaryData(decodedQueryText);
    const title = ancillaryDataTitle ?? decodedIdentifier;
    const description =
      ancillaryDataDescription ?? "No description was found for this request.";
    const umipNumber = "umip-107";
    const umipUrl =
      "https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-107.md";

    return {
      title,
      description,
      umipUrl,
      umipNumber,
      project: "Polymarket",
    };
  }

  const isCozy = checkIfIsCozy(decodedQueryText);
  if (isCozy) {
    const ancillaryDataTitle = getTitleFromAncillaryData(decodedQueryText);
    const ancillaryDataDescription =
      getDescriptionFromAncillaryData(decodedQueryText);
    const title = ancillaryDataTitle ?? decodedIdentifier;
    const description =
      ancillaryDataDescription ?? "No description was found for this request.";
    const umipNumber = "umip-107";
    const umipUrl =
      "https://github.com/UMAprotocol/UMIPs/blob/master/UMIPs/umip-107.md";

    return {
      title,
      description,
      umipUrl,
      umipNumber,
      project: "Cozy Finance",
    };
  }

  const identifierDetails = approvedIdentifiers[decodedIdentifier];
  const isApprovedIdentifier = Boolean(identifierDetails);
  if (isApprovedIdentifier) {
    const isSherlock = decodedIdentifier === "SHERLOCK_CLAIM";
    const title = isSherlock ? "Sherlock Claim" : identifierDetails.identifier;
    const description = identifierDetails.summary;
    const umipUrl = identifierDetails.umipLink.url;
    const umipNumber = identifierDetails.umipLink.number;
    const project = isSherlock ? "Sherlock" : "Unknown";
    return {
      title,
      description,
      umipUrl,
      umipNumber,
      project,
    };
  }

  // if all checks fail, return with generic values generated from the data we have
  return {
    title: decodedIdentifier,
    description: "No description found for this request.",
    umipUrl: undefined,
    umipNumber: undefined,
    project: "Unknown",
  };
}

function getTitleFromAncillaryData(
  decodedAncillaryData: string,
  titleIdentifier = "title:",
  descriptionIdentifier = "description:"
) {
  const start = decodedAncillaryData.indexOf(titleIdentifier);
  const end =
    decodedAncillaryData.indexOf(descriptionIdentifier) ??
    decodedAncillaryData.length;

  if (start === -1) {
    return undefined;
  }

  const title = decodedAncillaryData
    .substring(start + titleIdentifier.length, end)
    .trim();
  // remove the trailing comma if it exists (from Polymarket)
  return title.endsWith(",") ? title.slice(0, -1) : title;
}

function getDescriptionFromAncillaryData(
  decodedAncillaryData: string,
  descriptionIdentifier = "description:"
) {
  if (!decodedAncillaryData) {
    return undefined;
  }
  const start = decodedAncillaryData.indexOf(descriptionIdentifier);
  const end = decodedAncillaryData.length;

  if (start === -1) {
    return undefined;
  }

  return decodedAncillaryData.substring(
    start + descriptionIdentifier.length,
    end
  );
}
