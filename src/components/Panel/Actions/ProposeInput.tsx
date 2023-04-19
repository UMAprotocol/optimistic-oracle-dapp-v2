import { DecimalInput, RadioDropdown } from "@/components";
import type { DropdownItem } from "@/types";
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
}
export function ProposeInput({ isCustomInput, ...props }: Props) {
  const isDropdown = !isCustomInput && !!props.items && props.items.length > 0;

  return (
    <Wrapper>
      {isDropdown ? <RadioDropdown {...props} /> : <DecimalInput {...props} />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 20px;
`;
