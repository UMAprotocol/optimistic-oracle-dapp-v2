import type { DropdownItem, OracleQueryUI } from "@/types";
import { useState } from "react";

export function useProposePriceInput({ proposeOptions }: OracleQueryUI) {
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputError, setInputError] = useState("");

  const selected = proposeOptions?.find(
    ({ value }) => value === proposePriceInput
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
    proposePriceInput,
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
