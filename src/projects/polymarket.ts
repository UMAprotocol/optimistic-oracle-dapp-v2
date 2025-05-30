import { earlyRequestMagicNumber } from "@/constants";
import type { DropdownItem } from "@/types";
import { chunk } from "lodash";
import { toHex } from "viem";
import type { Address } from "wagmi";

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

export function getInitializerAddress(
  decodedAncillaryData: string | undefined,
): Address | undefined {
  const matchOwnerAddress = decodedAncillaryData
    ? decodedAncillaryData.match(/initializer:([a-fA-F0-9]{40})/)
    : undefined;
  if (matchOwnerAddress) {
    return toHex(matchOwnerAddress[1]);
  }
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

  // this is a specific search for "neg risk markets" which only have p1/p2 options an no p3
  const options4 = {
    // note that these end with a period
    resData: "res_data: p1: 0, p2: 1, p3: 0.5",
    corresponds: "Where p1 corresponds to No, p2 to Yes, p3 to unknown",
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

  if (
    decodedAncillaryData.includes(options4.resData) &&
    decodedAncillaryData.includes(options4.corresponds)
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
