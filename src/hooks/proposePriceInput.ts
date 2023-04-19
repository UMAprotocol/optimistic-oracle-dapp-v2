import { useState } from "react";

export function useProposePriceInput() {
  const [proposePriceInput, setProposePriceInput] = useState("");
  const [inputError, setInputError] = useState("");

  return {
    proposePriceInput,
    setProposePriceInput,
    inputError,
    setInputError,
  };
}
