import {
  Box,
  checkboxItem,
  ItemCount,
  ItemName,
  NameAndBoxWrapper,
} from "@/components";
import {
  CheckboxItem,
  DropdownMenuCheckboxItemProps,
  ItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import { ReactNode } from "react";
import styled from "styled-components";
import { ChevronIcon, Content, Portal, Root, Trigger } from "./style";

export type CheckedState = DropdownMenuCheckboxItemProps["checked"];

export type Item = {
  checked: CheckedState;
  count: number;
};

export type Items = {
  All: Item;
  [key: string]: Item;
};

interface Props {
  title: ReactNode;
  items: Items;
  onCheckedChange: ({
    checked,
    itemName,
  }: {
    checked: CheckedState;
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
    <Root modal={false}>
      <Trigger>
        {title} <ChevronIcon />
      </Trigger>
      <Portal>
        <Content>
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
              <NameAndBoxWrapper>
                <Box $checked={checked}>
                  <ItemIndicator>
                    <Check />
                  </ItemIndicator>
                </Box>
                <ItemName>{itemName}</ItemName>
              </NameAndBoxWrapper>
              <ItemCount>{count}</ItemCount>
            </_CheckboxItem>
          ))}
        </Content>
      </Portal>
    </Root>
  );
}

const _CheckboxItem = styled(CheckboxItem)`
  ${checkboxItem}
`;
