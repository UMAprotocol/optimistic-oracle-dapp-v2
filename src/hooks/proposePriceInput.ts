import { encodeMultipleQuery } from "@/helpers";
import type { DropdownItem, OracleQueryUI } from "@/types";
import { maxInt256 } from "@libs/constants";
import { useEffect, useMemo, useState } from "react";

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
      setProposePriceInput("");
    } else {
      setProposePriceInput((item.value ?? "").toString());
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
      proposeOptions?.map((o) => [o.label, (o.value ?? "").toString()]) ?? [],
    ),
  );

  const [isUnresolvable, setIsUnresolvable] = useState(false);

  useEffect(() => {
    setProposePriceInput(
      Object.fromEntries(
        proposeOptions?.map((o) => [o.label, (o.value ?? "").toString()]) ?? [],
      ),
    );
    setInputError("");
  }, [proposeOptions]);

  const [inputError, setInputError] = useState<string>("");

  function onChange(item: DropdownItem) {
    setProposePriceInput((current) => {
      return {
        ...current,
        [item.label]: String(item.value),
      };
    });
  }

  const formattedValue = useMemo(() => {
    try {
      if (isUnresolvable) {
        setInputError("");
        return maxInt256.toString();
      } else {
        setInputError("");
        return encodeMultipleQuery(Object.values(proposePriceInput));
      }
    } catch (err) {
      if (err instanceof Error) {
        setInputError(err.message);
      }
    }
    return undefined;
  }, [isUnresolvable, inputError, proposePriceInput]);

  return {
    isUnresolvable,
    setIsUnresolvable,
    inputType: INPUT_TYPES.MULTIPLE,
    proposePriceInput,
    value: proposePriceInput,
    formattedValue,
    inputError,
    items: proposeOptions,
    onChange,
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
