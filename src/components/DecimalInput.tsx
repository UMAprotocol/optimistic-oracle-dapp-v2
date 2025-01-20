import { useHandleDecimalInput } from "@/hooks";
import styled from "styled-components";

interface Props {
  value: string;
  onInput: (value: string) => void;
  onClear?: () => void;
  addErrorMessage: (message: string) => void;
  removeErrorMessage: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxDecimals?: number;
  allowNegative?: boolean;
  className?: string;
  id?: string;
}
/**
 * A component for entering decimal values.
 * @param value The current value of the input.
 * @param onInput A callback to be called when the input value changes.
 * @param addErrorMessage A callback to be called when an error message should be displayed.
 * @param removeErrorMessage A callback to be called when an error message should be removed.
 * @param disabled Whether the input should be disabled.
 * @param placeholder The placeholder text to display when the input is empty.
 * @param maxDecimals The maximum number of decimal places to allow.
 * @param allowNegative Whether to allow negative values.
 */
export function DecimalInput({
  value,
  onInput,
  addErrorMessage,
  removeErrorMessage,
  disabled,
  placeholder,
  maxDecimals = 18,
  allowNegative = true,
  id,
}: Props) {
  const onChange = useHandleDecimalInput({
    onInput,
    addErrorMessage,
    removeErrorMessage,
    maxDecimals,
    allowNegative,
  });

  function makeStep() {
    return maxDecimals ? `0.${"0".repeat(maxDecimals - 1)}1` : "1";
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
        id={id}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font: var(--body-md);
  max-width: var(--panel-content-width);
  &[aria-disabled="true"] {
    opacity: 0.25;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding-left: 16px;
  border: 1px solid var(--blue-grey-500);
  border-radius: 4px;
  color: var(--dark-text);

  :disabled {
    cursor: not-allowed;
  }

  ::placeholder {
    color: var(--blue-grey-400);
  }

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
