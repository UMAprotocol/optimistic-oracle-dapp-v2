import { earlyRequestMagicNumber } from "@/constants";
import approvedIdentifiers from "@/data/approvedIdentifiersTable";
import type { DropdownItem, MetaData } from "@/types";
import { chunk } from "lodash";

function makeSimpleYesOrNoOptions() {
  return [
    { label: "Yes", value: "1", secondaryLabel: "1" },
    { label: "No", value: "0", secondaryLabel: "0" },
  ];
}
export function isOptimisticGovernor(decodedAncillaryData: string) {
  return (
    decodedAncillaryData.includes("rules:") &&
    decodedAncillaryData.includes("explanation:")
  );
}

export function isYesOrNo(decodedIdentifier: string) {
  return decodedIdentifier === "YES_OR_NO_QUERY";
}

export function checkIfIsCozy(decodedAncillaryData: string) {
  const cozyToken = "This will revert if a non-YES answer is proposed.";
  if (decodedAncillaryData.includes(cozyToken)) {
    return true;
  }
  return false;
}

export function checkIfIsPolymarket(
  decodedIdentifier: string,
  decodedAncillaryData: string,
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
  decodedQueryText: string,
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
      proposeOptions: makeSimpleYesOrNoOptions(),
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
      proposeOptions: maybeMakePolymarketOptions(decodedQueryText),
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
      proposeOptions: makeSimpleYesOrNoOptions(),
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
      proposeOptions: isYesOrNo(decodedIdentifier)
        ? makeSimpleYesOrNoOptions()
        : undefined,
      project,
    };
  }

  // if all checks fail, return with generic values generated from the data we have
  return {
    title: decodedIdentifier,
    description: "No description found for this request.",
    umipUrl: undefined,
    umipNumber: undefined,
    proposeOptions: undefined,
    project: "Unknown",
  };
}

function getTitleFromAncillaryData(
  decodedAncillaryData: string,
  titleIdentifier = "title:",
  descriptionIdentifier = "description:",
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
  descriptionIdentifier = "description:",
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
    end,
  );
}

// this will only work when there are exactly 3 or more proposeOptions, which should match most polymarket requests
// it will only parse 3 proposeOptions, omitting p4, which is assumed to be "too early".
function dynamicPolymarketOptions(
  decodedAncillaryData: string,
): DropdownItem[] {
  const resData = decodedAncillaryData.match(
    /res_data: (p\d): (\d+\.\d+|\d+), (p\d): (\d+\.\d+|\d+), (p\d): (\d+\.\d+|\d+)/,
  );
  const correspondence = decodedAncillaryData.match(
    /Where (p\d) corresponds to ([^,]+), (p\d) to ([^,]+), (p\d) to ([^.,]+)/,
  );

  if (!resData || !correspondence) return [];

  const cleanCorrespondence = correspondence.map((data) => {
    if (data.toLowerCase().includes("a no")) {
      return "No";
    }
    return data.trim();
  });

  const correspondenceTable = Object.fromEntries(
    chunk(cleanCorrespondence.slice(1), 2),
  ) as Record<string, string>;
  const resDataTable = Object.fromEntries(chunk(resData.slice(1), 2)) as Record<
    string,
    string
  >;

  return Object.keys(resDataTable)
    .filter((pValue) => correspondenceTable[pValue] && resDataTable[pValue])
    .map((pValue) => {
      return {
        label: correspondenceTable[pValue],
        value: resDataTable[pValue],
        secondaryLabel: pValue,
      };
    });
}
/** Polymarket yes or no queries follow a semi-predictable pattern.
 * If both the res data and the correspondence to the res data are present,
 * we can use the res data to make the proposeOptions for the vote.
 *
 * The res data always has proposeOptions for "yes", "no", and "unknown", and it sometimes has an option for "early request as well".
 */
export function maybeMakePolymarketOptions(
  decodedAncillaryData: string,
): DropdownItem[] | undefined {
  const options1 = {
    resData: "res_data: p1: 0, p2: 1, p3: 0.5",
    corresponds: "Where p2 corresponds to Yes, p1 to a No, p3 to unknown",
  };

  const options2 = {
    resData: `res_data: p1: 0, p2: 1, p3: 0.5, p4: ${earlyRequestMagicNumber}`,
    corresponds:
      "Where p1 corresponds to No, p2 to a Yes, p3 to unknown, and p4 to an early request",
  };

  const dynamicOptions = dynamicPolymarketOptions(decodedAncillaryData);

  if (
    decodedAncillaryData.includes(options1.resData) &&
    decodedAncillaryData.includes(options1.corresponds)
  ) {
    return [
      {
        label: "No",
        value: "0",
        secondaryLabel: "p1",
      },
      {
        label: "Yes",
        value: "1",
        secondaryLabel: "p2",
      },
      {
        label: "Unknown",
        value: "0.5",
        secondaryLabel: "p3",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }

  if (
    decodedAncillaryData.includes(options2.resData) &&
    decodedAncillaryData.includes(options2.corresponds)
  ) {
    return [
      {
        label: "No",
        value: "0",
        secondaryLabel: "p1",
      },
      {
        label: "Yes",
        value: "1",
        secondaryLabel: "p2",
      },
      {
        label: "Unknown",
        value: "0.5",
        secondaryLabel: "p3",
      },
      {
        label: "Early request",
        value: earlyRequestMagicNumber,
        secondaryLabel: "p4",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }

  // this will only display if we have dynamically found 3 proposeOptions, otherwise fallback to custom input
  if (dynamicOptions.length >= 3) {
    return [
      ...dynamicOptions,
      // we will always append early request and custom input
      {
        label: "Early request",
        value: earlyRequestMagicNumber,
        secondaryLabel: "p4",
      },
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }
}
