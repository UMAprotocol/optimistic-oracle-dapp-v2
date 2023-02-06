import { ChangeEvent } from "react";

interface DecimalInput {
  onInput: (value: string) => void;
  addErrorMessage: (errorMessage: string) => void;
  removeErrorMessage: (errorMessage: string) => void;
  maxDecimals: number;
  allowNegative: boolean;
}
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
