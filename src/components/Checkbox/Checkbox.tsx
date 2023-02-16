import { Indicator, Root } from "@radix-ui/react-checkbox";
import Check from "public/assets/icons/check.svg";
import styled from "styled-components";
import { CheckedState } from "../Dropdown/CheckboxDropdown";
import {
  Box,
  checkboxItem,
  ItemCount,
  ItemName,
  NameAndBoxWrapper,
} from "./style";

interface Props {
  checked: CheckedState;
  itemName: string;
  count: number;
  onCheckedChange: ({
    checked,
    itemName,
  }: {
    checked: CheckedState;
    itemName: string;
  }) => void;
}
export function Checkbox({ itemName, checked, count, onCheckedChange }: Props) {
  return (
    <Wrapper
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange({ checked, itemName })}
      disabled={count === 0}
    >
      <NameAndBoxWrapper>
        <Box $checked={checked}>
          <Indicator>
            <Check />
          </Indicator>
        </Box>
        <ItemName>{itemName}</ItemName>
      </NameAndBoxWrapper>
      <ItemCount>{count}</ItemCount>
    </Wrapper>
  );
}

const Wrapper = styled(Root)`
  width: 100%;
  background: transparent;
  ${checkboxItem}
`;
