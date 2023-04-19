import { DecimalInput, RadioDropdown } from "@/components";
import type { DropdownItem } from "@/types";
import Close from "public/assets/icons/close.svg";
import styled from "styled-components";

interface Props {
  value: string;
  disabled: boolean;
  items: DropdownItem[] | undefined;
  selected: DropdownItem | undefined;
  isCustomInput: boolean;
  onInput: (value: string) => void;
  onSelect: (item: DropdownItem) => void;
  addErrorMessage: (value: string) => void;
  removeErrorMessage: () => void;
  exitCustomInput: () => void;
}
export function ProposeInput({
  isCustomInput,
  exitCustomInput,
  ...props
}: Props) {
  const isDropdown = !isCustomInput && !!props.items && props.items.length > 0;

  return (
    <Wrapper>
      {isDropdown ? <RadioDropdown {...props} /> : <DecimalInput {...props} />}
      {isCustomInput && (
        <ClearInputButton
          aria-label="exit custom input"
          onClick={exitCustomInput}
          disabled={props.disabled}
        >
          <CloseIcon />
        </ClearInputButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const ClearInputButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--grey-100);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

const CloseIcon = styled(Close)`
  width: 10px;
  path {
    fill: var(--dark-text);
  }
`;
