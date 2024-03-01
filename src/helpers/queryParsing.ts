import { earlyRequestMagicNumber } from "@/constants";
import approvedIdentifiers from "@/data/approvedIdentifiersTable";
import type { DropdownItem, MetaData } from "@/types";
import { chunk } from "lodash";

// hard coded known poly addresses:
// https://github.com/UMAprotocol/protocol/blob/master/packages/monitor-v2/src/monitor-polymarket/common.ts#L474
const polymarketBinaryAdapterAddress =
  "0xCB1822859cEF82Cd2Eb4E6276C7916e692995130";
const polymarketCtfAdapterAddress =
  "0x6A9D222616C90FcA5754cd1333cFD9b7fb6a4F74";
const polymarketCtfAdapterAddressV2 =
  "0x2f5e3684cb1f318ec51b00edba38d79ac2c0aa9d";
const polymarketCtfExchangeAddress =
  "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E";

export const polymarketRequesters = [
  polymarketBinaryAdapterAddress.toLowerCase(),
  polymarketCtfAdapterAddress.toLowerCase(),
  polymarketCtfAdapterAddressV2.toLowerCase(),
  polymarketCtfExchangeAddress.toLowerCase(),
];

export function isPolymarketRequester(address: string): boolean {
  return polymarketRequesters.includes(address.toLowerCase());
}

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
  requester: string,
) {
  const queryTitleToken = "q: title:";
  const resultDataToken = "res_data:";
  const isPolymarket =
    isPolymarketRequester(requester) &&
    decodedIdentifier === "YES_OR_NO_QUERY" &&
    decodedAncillaryData.includes(queryTitleToken) &&
    decodedAncillaryData.includes(resultDataToken);

  return isPolymarket;
}

export function getQueryMetaData(
  decodedIdentifier: string,
  decodedQueryText: string,
  requester: string,
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

  const isPolymarket = checkIfIsPolymarket(
    decodedIdentifier,
    decodedQueryText,
    requester,
  );
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
    /Where (p\d) corresponds to ((?:[^,]|,(?!\s))+), (p\d) to ((?:[^,]|,(?!\s))+), (p\d) to ([^.,]+)/,
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

// res_data: p1: 0, p2: 1. Where p1 corresponds to No, p2 to Yes.
export function maybeMakePolymarketOptions(
  decodedAncillaryData: string,
): DropdownItem[] | undefined {
  // this is a specific search to look for a misspelling with options "p2 to a Yes"
  const options1 = {
    resData: `res_data: p1: 0, p2: 1, p3: 0.5, p4: ${earlyRequestMagicNumber}`,
    corresponds:
      "Where p1 corresponds to No, p2 to a Yes, p3 to unknown, and p4 to an early request",
  };

  // this is a specific search to look for a misspelling with options "p2 to a No"
  const options2 = {
    resData: "res_data: p1: 0, p2: 1, p3: 0.5",
    corresponds: "Where p2 corresponds to Yes, p1 to a No, p3 to unknown",
  };

  // this is a specific search for "neg risk markets" which only have p1/p2 options an no p3
  const options3 = {
    // note that these end with a period
    resData: "res_data: p1: 0, p2: 1.",
    corresponds: "Where p1 corresponds to No, p2 to Yes.",
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
        label: "Custom",
        value: "custom",
      },
    ];
  }

  if (
    decodedAncillaryData.includes(options3.resData) &&
    decodedAncillaryData.includes(options3.corresponds)
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
        label: "Custom",
        value: "custom",
      },
    ];
  }

  // this will only display if we have dynamically found 3 proposeOptions, otherwise fallback to custom input
  if (dynamicOptions.length >= 3) {
    return [
      ...dynamicOptions,
      // we will always append custom input
      {
        label: "Custom",
        value: "custom",
      },
    ];
  }
}
