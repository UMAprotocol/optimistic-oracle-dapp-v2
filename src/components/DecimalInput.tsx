import { useHandleDecimalInput } from "@/hooks";
import styled from "styled-components";

interface Props {
  value: string;
  onInput: (value: string) => void;
  addErrorMessage: (message: string) => void;
  removeErrorMessage: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxDecimals?: number;
  allowNegative?: boolean;
}
export function DecimalInput({
  value,
  onInput,
  addErrorMessage,
  removeErrorMessage,
  disabled,
  placeholder,
  maxDecimals = 18,
  allowNegative = true,
}: Props) {
  const onChange = useHandleDecimalInput({
    onInput,
    addErrorMessage,
    removeErrorMessage,
    maxDecimals,
    allowNegative,
  });

  function makeStep() {
    return `0.${"0".repeat(maxDecimals - 1)}1`;
  }

  return (
    <Wrapper aria-disabled={disabled}>
      <Input
        value={value ?? undefined}
        onChange={onChange}
        type="number"
        step={makeStep()}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        placeholder={placeholder ?? "Enter value"}
        minLength={1}
        maxLength={79}
        spellCheck="false"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font: var(--text-md);
  max-width: 510px;
  &[aria-disabled="true"] {
    opacity: 0.25;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 45px;
  padding-left: 15px;
  border: 1px solid var(--black);
  border-radius: 5px;
  color: var(--black-opacity-50);

  :disabled {
    cursor: not-allowed;
  }

  ::placeholder {
    color: var(--black-opacity-50);
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
