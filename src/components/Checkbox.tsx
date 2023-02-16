import {
  CheckboxBox,
  checkboxItem,
  CheckboxItemCount,
  CheckboxItemName,
  CheckboxNameAndBoxWrapper,
} from "@/components/style";
import { CheckboxState } from "@/types";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import Check from "public/assets/icons/check.svg";
import styled from "styled-components";

interface Props {
  checked: CheckboxState;
  itemName: string;
  count: number;
  onCheckedChange: ({
    checked,
    itemName,
  }: {
    checked: CheckboxState;
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
      <CheckboxNameAndBoxWrapper>
        <CheckboxBox $checked={checked}>
          <Indicator>
            <Check />
          </Indicator>
        </CheckboxBox>
        <CheckboxItemName>{itemName}</CheckboxItemName>
      </CheckboxNameAndBoxWrapper>
      <CheckboxItemCount>{count}</CheckboxItemCount>
    </Wrapper>
  );
}

const Wrapper = styled(Root)`
  width: 100%;
  background: transparent;
  ${checkboxItem}
`;
