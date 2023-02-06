import { ChangeEvent } from "react";

interface DecimalInput {
  onInput: (value: string) => void;
  addErrorMessage: (errorMessage: string) => void;
  removeErrorMessage: (errorMessage: string) => void;
  maxDecimals: number;
  allowNegative: boolean;
}
/**
 * This hook is used to handle decimal inputs. It will add an error message if the user tries to enter a number with more than the specified number of decimals, or if the user tries to enter a negative number when `allowNegative` is set to false.
 * @param onInput A callback function that is called with the input value as a string.
 * @param addErrorMessage A callback function that is called with an error message to add to the error message array.
 * @param removeErrorMessage A callback function that is called with an error message to remove from the error message array.
 * @param maxDecimals The maximum number of decimals allowed.
 * @param allowNegative Whether or not to allow negative numbers.
 * @returns A function that should be called on the `onChange` event of the input.
 */
export function useHandleDecimalInput({
  onInput,
  addErrorMessage,
  removeErrorMessage,
  maxDecimals,
  allowNegative,
}: DecimalInput) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const noNegativeNumbersErrorMessage = "Negative numbers are not allowed";

    if (!allowNegative && value.includes("-")) {
      addErrorMessage(noNegativeNumbersErrorMessage);
      return;
    }

    const decimalsErrorMessage = `Cannot have more than ${maxDecimals} decimals.`;
    const negativeAllowedDecimalRegex = /^-?\d*\.?\d{0,}$/;
    const onlyPositiveDecimalsRegex = /^\d*\.?\d{0,}$/;
    const decimalsRegex = allowNegative
      ? negativeAllowedDecimalRegex
      : onlyPositiveDecimalsRegex;
    const isValidDecimalNumber = decimalsRegex.test(value);

    if (!isValidDecimalNumber) return;

    const hasDecimals = value.includes(".");

    if (hasDecimals) {
      const decimals = value.split(".")[1];
      const hasTooManyDecimals = decimals.length > maxDecimals;
      if (hasTooManyDecimals) {
        addErrorMessage(decimalsErrorMessage);
        return;
      }
    }

    removeErrorMessage(decimalsErrorMessage);
    onInput(value);
  };
}
