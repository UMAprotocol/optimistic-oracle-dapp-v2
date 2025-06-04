import { earlyRequestMagicNumber } from "@/constants";
import type { DropdownItem } from "@/types";
import { chunk } from "lodash";
import { Project } from "./abstract";

export class PolymarketProject extends Project<"Polymarket"> {
  constructor() {
    super({
      name: "Polymarket",
      identifiers: ["YES_OR_NO_QUERY", "MULTIPLE_VALUES"],
      initializers: [
        "0xC789d2C42502A2548eEF3eDBe84dFe9ED233403A",
        "0x91430CaD2d3975766499717fA0D66A78D814E5c5",
        "0xCD2CCA82e43Ca9E21d48564bB18897273Ada4a69",
        "0x3162A9c12624DD2D4491fEA90FEb7AbBB481D7FC",
        "0x70A66740774e7CA5739a454C60d72f2b0B7a0570",
        "0x4ae84763ae13F0381CA6dA06B804EF9E64CE6B59",
        "0xE4D717ae9467Be8ED8bD84A0e03a279e7150d459",
        "0x91190A80eE09B55200f1622012eAf494Cc25a6a3",
        "0x8A667535eB42F942186C30E70c72483612E0854b",
        "0x084EA0bAC17aD8a23A84F596b4adcA432aa118A3",
        "0x9E2ad3FB89B6357b601932B673f77B371ff91871",
      ],
      requesters: [
        "0xcb1822859cef82cd2eb4e6276c7916e692995130", // Polymarket Binary Adapter Address
        "0x6a9d222616c90fca5754cd1333cfd9b7fb6a4f74", // Polymarket CTF Adapter Address
        "0x2f5e3684cb1f318ec51b00edba38d79ac2c0aa9d", // Polymarket CTF Adapter Address V2
        "0x4bfb41d5b3570defd03c39a9a4d8de6bd8b8982e", // Polymarket CTF Exchange Address
        "0xb21182d0494521cf45dbbeebb5a3acaab6d22093", // Polymarket Sports Address
      ],
      requiredTokens: {
        YES_OR_NO_QUERY: ["q: title:", "res_data:"],
      },
    });
  }

  makeProposeOptions(
    decodedAncillaryData: string,
    decodedIdentifier: string,
  ): DropdownItem[] | undefined {
    switch (decodedIdentifier) {
      case "YES_OR_NO_QUERY":
        return maybeMakePolymarketOptions(decodedAncillaryData);
      default:
        return undefined;
    }
  }
}

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
  try {
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
  } catch (e) {
    console.error("Error making Polymarket Options", e);
    return;
  }
}
