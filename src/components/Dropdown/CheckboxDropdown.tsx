import { blueGrey700, white } from "@/constants";
import {
  CheckboxItem,
  DropdownMenuCheckboxItemProps,
  ItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import { ReactNode } from "react";
import styled, { CSSProperties } from "styled-components";
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
 * @param setChecked A callback to be called when the checked state of an item changes.
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
                <Box
                  style={
                    {
                      "--background": checked ? blueGrey700 : white,
                    } as CSSProperties
                  }
                >
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

const NameAndBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemName = styled.span``;

const ItemCount = styled.span`
  color: var(--blue-grey-400);
`;

const Box = styled.div`
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  background: var(--background);
  border: 1px solid var(--blue-grey-700);
  border-radius: 4px;
  transition: background var(--animation-duration);
`;

const _CheckboxItem = styled(CheckboxItem)`
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 12px;
  }

  &[data-disabled] {
    ${ItemName} {
      color: var(--blue-grey-400);
    }
    ${Box} {
      border: 1px solid var(--blue-grey-400);
    }
  }
`;
