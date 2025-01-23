import {
  CheckboxBox,
  checkboxItem,
  CheckboxItemCount,
  CheckboxItemName,
  CheckboxNameAndBoxWrapper,
} from "@/components/style";
import type { CheckboxState } from "@/types";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import Check from "public/assets/icons/check.svg";
import styled from "styled-components";

interface Props {
  checked: CheckboxState;
  itemName: string;
  onCheckedChange: ({
    checked,
    itemName,
  }: {
    checked: CheckboxState;
    itemName: string;
  }) => void;
  count?: number;
  className?: string;
}
/**
 * A checkbox component that is used in the filters component.
 * @param itemName The name of the checkbox item.
 * @param checked Whether the checkbox is checked or not.
 * @param count The number of items that match the checkbox item.
 * @param onCheckedChange A callback function that is called when the checkbox is checked or unchecked.
 */
export function Checkbox({
  itemName,
  checked,
  count,
  onCheckedChange,
  className,
}: Props) {
  return (
    <Wrapper
      className={className}
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
      {count !== undefined && <CheckboxItemCount>{count}</CheckboxItemCount>}
    </Wrapper>
  );
}

const Wrapper = styled(Root)`
  width: 100%;
  background: transparent;
  ${checkboxItem}
`;
