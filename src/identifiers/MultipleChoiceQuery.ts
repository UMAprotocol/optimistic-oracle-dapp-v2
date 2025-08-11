import { getTitleAndDescriptionFromJson } from "@/helpers/queryParsing";
import { Identifier } from "./abstract";
import type { MetaData } from "./abstract";
import { formatEther } from "@/helpers";
import type { DropdownItem } from "@/types";

type MultipleChoiceData = {
  // Require a title string
  title: string;
  // The full description of the question, optionally using markdown.
  description: string;
  // Optionally specify labels and values for each option a user can select.
  // If not specified the default is ["no", "yes"], which corresponds to prices ['0','1'] in wei.
  // numbers must be convertible to a signed int256, and specified as integers in base 10.
  options?: [label: string, value: string][];
};

export class MultipleChoiceQuery extends Identifier {
  constructor() {
    super({
      name: "MULTIPLE_CHOICE_QUERY",
      umipNumber: 181,
    });
  }

  getMetaData(decodedAncillaryData: string): MetaData {
    const metaData = getTitleAndDescriptionFromJson(decodedAncillaryData);

    return {
      title: metaData?.title ?? this.name,
      description: metaData?.description ?? decodedAncillaryData,
      umipUrl: this.umipUrl,
      umipNumber: this.umipNumber,
    };
  }

  parseQuery(decodedAncillaryData: string) {
    return {
      ...this.getMetaData(decodedAncillaryData),
      proposeOptions: this.makeProposeOptions(decodedAncillaryData),
    };
  }

  makeDefaultProposeOptions(): DropdownItem[] {
    const defaultOptions = [
      { label: "Yes", value: formatEther("1"), secondaryLabel: "1" },
      { label: "No", value: "0", secondaryLabel: "0" },
    ];

    return [
      ...defaultOptions,
      {
        label: "Answer not possible",
        value:
          "57896044618658097711785492504343953926634992332820282019728.792003956564819967",
        secondaryLabel: "type(int256).max",
      },
    ];
  }

  makeProposeOptions(decodedAncillaryData: string): DropdownItem[] {
    try {
      // Try to parse the multiple choice query
      const endOfObjectIndex = decodedAncillaryData.lastIndexOf("}");
      const maybeJson =
        endOfObjectIndex > 0
          ? decodedAncillaryData.slice(0, endOfObjectIndex + 1)
          : decodedAncillaryData;

      const json = JSON.parse(maybeJson);

      // Check if the JSON has the expected format
      if (!json || !this.isMultipleChoiceQuery(json)) {
        return this.makeDefaultProposeOptions();
      }

      // Return options from the JSON or default if not specified
      const optionsFromJson = json.options ?? [
        ["No", "0"],
        ["Yes", formatEther("1")],
      ];

      const formattedOptions = optionsFromJson.map((opt: [string, string]) => ({
        label: opt[0],
        value: formatEther(this.ensureInteger(opt[1])),
        secondaryLabel: `${opt[1]}`,
      }));

      return [
        ...formattedOptions,
        {
          label: "Answer not possible",
          value:
            "57896044618658097711785492504343953926634992332820282019728.792003956564819967",
          secondaryLabel: "type(int256).max",
        },
      ];
    } catch (err) {
      console.debug(
        "Failed to parse multiple choice query. Using default propose options.",
        err,
      );
      // If parsing fails, return default options
      return this.makeDefaultProposeOptions();
    }
  }

  private isMultipleChoiceQuery(
    decodedAncillaryData: unknown,
  ): decodedAncillaryData is MultipleChoiceData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $io0 = (input: any): boolean =>
      "string" === typeof input?.title && //eslint-disable-line
      "string" === typeof input?.description && //eslint-disable-line
      (undefined === input?.options || //eslint-disable-line
        (Array.isArray(input.options) && //eslint-disable-line
          //eslint-disable-next-line
          input.options.every(
            //eslint-disable-line
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (elem: any) =>
              Array.isArray(elem) &&
              elem.length === 2 &&
              "string" === typeof elem[0] &&
              "string" === typeof elem[1],
          )));
    return (
      "object" === typeof decodedAncillaryData &&
      null !== decodedAncillaryData &&
      $io0(decodedAncillaryData)
    );
  }

  private ensureInteger(value: string): string {
    const num = Number(value);
    if (!Number.isInteger(num)) {
      throw new Error(
        `The value '${value}' needs to be specified in WEI, integers only.`,
      );
    }
    return value;
  }
}
