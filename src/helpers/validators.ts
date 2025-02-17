import { maxInt256, minInt256 } from "@libs/constants";
import { decodeMultipleQuery } from "./converters";

export function isMultipleValuesInputValid(
  inputValues: string | undefined,
  numOptions: number,
): boolean {
  if (!inputValues) false;
  let decodedInputValues;
  try {
    decodedInputValues = decodeMultipleQuery(inputValues ?? "", numOptions);
  } catch (error) {
    console.error(error);
    return false;
  }

  if (!Array.isArray(decodedInputValues)) {
    return isUnresolvable(decodedInputValues);
  }

  return (
    decodedInputValues.length > 0 &&
    decodedInputValues.every((val) => val !== undefined && val.length > 0)
  );
}

export function isInputValid(inputValue: string): boolean {
  return inputValue !== undefined && inputValue.length > 0;
}

export function isTooEarly(price: bigint | string): boolean {
  return typeof price === "string"
    ? price === minInt256.toString()
    : price === minInt256;
}

export function isUnresolvable(price: bigint | string): boolean {
  return typeof price === "string"
    ? price === maxInt256.toString()
    : price === maxInt256;
}
