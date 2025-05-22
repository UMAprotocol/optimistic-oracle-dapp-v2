import { getTitleAndDescriptionFromTokens } from "../helpers/queryParsing";
import * as s from "superstruct";
import { Identifier } from "./abstract";
import type { MetaData } from "./abstract";
import type { DropdownItem } from "@/types/ui";

const MultipleValuesQuery = s.object({
  // The title of the request
  title: s.string(),
  // Description of the request
  description: s.string(),
  // Values will be encoded into the settled price in the same order as the provided labels. The oracle UI will display each Label along with an input field. 7 labels maximum.
  labels: s.array(s.string()),
});
type MultipleValuesData = s.Infer<typeof MultipleValuesQuery>;

export class MultipleValues extends Identifier {
  constructor() {
    super({
      name: "MULTIPLE_VALUES",
      umipNumber: 183,
    });
  }

  getMetaData(decodedAncillaryData: string): MetaData {
    const { title, description } =
      getTitleAndDescriptionFromTokens(decodedAncillaryData);

    return {
      title: title ?? this.name,
      description: description ?? decodedAncillaryData,
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
    // Multiple Values doesn't have fixed default options
    // TODO: fix stub
    return [
      { label: "Team A", value: undefined, secondaryLabel: undefined },
      { label: "Team B", value: undefined, secondaryLabel: undefined },
    ];
  }

  makeProposeOptions(decodedAncillaryData: string): DropdownItem[] {
    try {
      const endOfObjectIndex = decodedAncillaryData.lastIndexOf("}");
      const maybeJson =
        endOfObjectIndex > 0
          ? decodedAncillaryData.slice(0, endOfObjectIndex + 1)
          : decodedAncillaryData;

      const json = JSON.parse(maybeJson);

      // Check if the JSON has the expected format
      if (!json || !this.isMultipleChoiceQuery(json)) {
        throw new Error(
          "Invalid MULTIPLE_VALUES request. Labels Array malformed",
        );
      }

      // Ensure no more than 7 labels
      if (json.labels.length > 7) {
        throw new Error("MULTIPLE_VALUES only supports up to 7 labels");
      }

      // Create options from labels
      return json.labels.map((opt: string) => ({
        label: opt,
        value: undefined,
        secondaryLabel: undefined,
      }));
    } catch (err) {
      console.error(err);
      // If parsing fails, return default options
      return this.makeDefaultProposeOptions();
    }
  }

  private isMultipleChoiceQuery(
    decodedAncillaryData: unknown,
  ): decodedAncillaryData is MultipleValuesData {
    return s.is(decodedAncillaryData, MultipleValuesQuery);
  }

  parseValue(value: bigint | string | null | undefined): string[] | null {
    if (value === null || value === undefined) return null;

    // TODO: check: unresolvable & too early

    const bigIntValue = typeof value === "string" ? BigInt(value) : value;
    const result: string[] = [];

    // Each value is 32 bits, and we can have up to 7 values
    for (let i = 0; i < 7; i++) {
      const extractedValue = Number(
        (bigIntValue >> BigInt(32 * i)) & BigInt(0xffffffff),
      );
      result.push(extractedValue.toString());
    }

    return result;
  }

  encodeValue(values: string[]): string {
    if (values.length > 7) {
      throw new Error("Maximum of 7 values allowed");
    }

    let encodedPrice = BigInt(0);

    for (let i = 0; i < values.length; i++) {
      if (values[i] === undefined || values[i] === "") {
        throw new Error("All values must be defined");
      }
      const numValue = Number(values[i]);
      if (!Number.isInteger(numValue)) {
        throw new Error("All values must be integers");
      }
      if (numValue > 0xffffffff || numValue < 0) {
        throw new Error("Values must be uint32 (0 <= value <= 2^32 - 1)");
      }
      encodedPrice |= BigInt(numValue) << BigInt(32 * i);
    }

    return encodedPrice.toString();
  }
}
