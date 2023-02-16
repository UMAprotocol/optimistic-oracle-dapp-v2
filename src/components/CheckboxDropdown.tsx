import {
  Box,
  checkboxItem,
  Content,
  DropdownChevronIcon,
  ItemCount,
  ItemName,
  NameAndBoxWrapper,
  Portal,
  Root,
  Trigger,
} from "@/components/style";
import type { CheckboxItems, CheckboxState } from "@/types";
import { CheckboxItem, ItemIndicator } from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import { ReactNode } from "react";
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
    <Root modal={false}>
      <Trigger>
        {title} <DropdownChevronIcon />
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
