import type { DropdownItem, OracleQueryUI } from "@/types";
import { useState } from "react";

export function useProposePriceInput(query: OracleQueryUI) {
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [inputError, setInputError] = useState("");

  const items = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  const selected = items.find(({ value }) => value === proposePriceInput);

  function onSelect(item: DropdownItem) {
    setProposePriceInput(item.value.toString());
  }

  function onClear() {
    setProposePriceInput("");
    setIsCustomInput(false);
  }

  return {
    proposePriceInput,
    inputError,
    items,
    selected,
    isCustomInput,
    onSelect,
    onClear,
    onInput: setProposePriceInput,
    addErrorMessage: setInputError,
    removeErrorMessage: () => setInputError(""),
  };
}
