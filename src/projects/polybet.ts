import { earlyRequestMagicNumber } from "@/constants";
import type { DropdownItem } from "@/types";
import { chunk } from "lodash";
import { Project } from "./abstract";

export class PolyBetProject extends Project<"PolyBet"> {
  constructor() {
    super({
      name: "PolyBet",
      identifiers: ["YES_OR_NO_QUERY"],
      requesters: [
        "0x7dbb803aeb717ae9b0420c30669e128d6aa2e304",
        "0xef888bc2bbe8e4858373cdd5edbff663aa194105",
      ],
      requiredTokens: {
        YES_OR_NO_QUERY: ["res_data:"],
      },
    });
  }

  makeProposeOptions(
    decodedAncillaryData: string,
    decodedIdentifier: string,
  ): DropdownItem[] | undefined {
    switch (decodedIdentifier) {
      case "YES_OR_NO_QUERY":
        return maybeMakePolybetOptions(decodedAncillaryData);
      default:
        return undefined;
    }
  }
}

// it will only parse 3 proposeOptions, omitting p4, which is assumed to be "too early".
function dynamicPolybetOptions(decodedAncillaryData: string): DropdownItem[] {
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

export function maybeMakePolybetOptions(
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

  const dynamicOptions = dynamicPolybetOptions(decodedAncillaryData);

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
