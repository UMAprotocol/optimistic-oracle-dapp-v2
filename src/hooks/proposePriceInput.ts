import { encodeMultipleQuery } from "@/helpers";
import type { DropdownItem, OracleQueryUI } from "@/types";
import { useState } from "react";

export const INPUT_TYPES = {
  SINGLE: "SINGLE",
  MULTIPLE: "MULTIPLE",
} as const;

export type InputType = keyof typeof INPUT_TYPES;

export type SingleInputProps = ReturnType<typeof useSinglePriceInput>;
export type MultipleInputProps = ReturnType<typeof useMultiplePriceInput>;

export type PriceInputProps = SingleInputProps | MultipleInputProps;

function useSinglePriceInput({ proposeOptions }: OracleQueryUI) {
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputError, setInputError] = useState("");

  const selected = proposeOptions?.find(
    ({ value }) => value === proposePriceInput,
  );

  function onSelect(item: DropdownItem) {
    if (item.value === "custom") {
      setIsCustomInput(true);
    } else {
      setProposePriceInput(item.value.toString());
    }
  }

  function exitCustomInput() {
    setProposePriceInput("");
    setIsCustomInput(false);
  }

  return {
    inputType: INPUT_TYPES.SINGLE,
    proposePriceInput,
    value: proposePriceInput,
    formattedValue: proposePriceInput,
    inputError,
    items: proposeOptions,
    selected,
    isCustomInput,
    onSelect,
    exitCustomInput,
    onInput: setProposePriceInput,
    addErrorMessage: setInputError,
    removeErrorMessage: () => setInputError(""),
  };
}

function useMultiplePriceInput({ proposeOptions }: OracleQueryUI) {
  const [proposePriceInput, setProposePriceInput] = useState(
    Object.fromEntries(
      proposeOptions?.map((o) => [o.label, String(o.value)]) ?? [],
    ),
  );

  const [inputError, setInputError] = useState("");

  function onChange(item: DropdownItem) {
    setProposePriceInput((current) => {
      return {
        ...current,
        [item.label]: String(item.value),
      };
    });
  }

  return {
    inputType: INPUT_TYPES.MULTIPLE,
    proposePriceInput,
    value: proposePriceInput,
    formattedValue: encodeMultipleQuery(
      Object.values(proposePriceInput).map((val) => val || "0"),
    ),
    inputError,
    items: proposeOptions,
    onChange,
    onInput: setProposePriceInput,
    addErrorMessage: setInputError,
    removeErrorMessage: () => setInputError(""),
  };
}

export function useProposePriceInput(query: OracleQueryUI) {
  const singleProps = useSinglePriceInput(query);
  const multipleInputProps = useMultiplePriceInput(query);
  if (query.identifier === "MULTIPLE_VALUES") {
    return multipleInputProps;
  }
  return singleProps;
}
