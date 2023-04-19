import {
  CheckboxBox,
  checkboxItem,
  CheckboxItemCount,
  CheckboxItemName,
  CheckboxNameAndBoxWrapper,
  DropdownChevronIcon,
  DropdownContent,
  DropdownPortal,
  DropdownRoot,
  DropdownTrigger,
} from "@/components/style";
import type { CheckboxItems, CheckboxState } from "@/types";
import { CheckboxItem, ItemIndicator } from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  title: ReactNode;
  items: CheckboxItems;
  onCheckedChange: ({
    checked,
    itemName,
  }: {
    checked: CheckboxState;
    itemName: string;
  }) => void;
}
/**
 * A dropdown menu with checkboxes.
 * @param title The title of the dropdown.
 * @param items The items to display in the dropdown.
 * @param onCheckedChange A callback to be called when the checked state of an item changes.
 */
export function CheckboxDropdown({ title, items, onCheckedChange }: Props) {
  return (
    <DropdownRoot modal={false}>
      <_Trigger>
        {title} <DropdownChevronIcon />
      </_Trigger>
      <DropdownPortal>
        <DropdownContent align="start" side="bottom" sideOffset={4}>
          {Object.entries(items).map(([itemName, { count, checked }]) => (
            <_CheckboxItem
              key={itemName}
              checked={checked}
              onCheckedChange={(checked) =>
                onCheckedChange({ checked, itemName })
              }
              onSelect={(e) => e.preventDefault()}
              disabled={count === 0}
            >
              <CheckboxNameAndBoxWrapper>
                <CheckboxBox $checked={checked}>
                  <ItemIndicator>
                    <Check />
                  </ItemIndicator>
                </CheckboxBox>
                <CheckboxItemName>{itemName}</CheckboxItemName>
              </CheckboxNameAndBoxWrapper>
              <CheckboxItemCount>{count}</CheckboxItemCount>
            </_CheckboxItem>
          ))}
        </DropdownContent>
      </DropdownPortal>
    </DropdownRoot>
  );
}

const _CheckboxItem = styled(CheckboxItem)`
  ${checkboxItem}
`;

const _Trigger = styled(DropdownTrigger)`
  border-radius: 24px;
`;
