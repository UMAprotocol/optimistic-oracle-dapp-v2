import { blueGrey700, white } from "@/constants";
import {
  CheckboxItem,
  DropdownMenuCheckboxItemProps,
  ItemIndicator,
} from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import { Dispatch, ReactNode, SetStateAction } from "react";
import styled, { CSSProperties } from "styled-components";
import { ChevronIcon, Content, Portal, Root, Trigger } from "./style";

type CheckedState = DropdownMenuCheckboxItemProps["checked"];

type Item = {
  checked: CheckedState;
  count: number;
};

type Name = string | "All";

export type Items = Record<Name, Item>;

interface Props {
  title: ReactNode;
  items: Items;
  setChecked: Dispatch<SetStateAction<Items>>;
}
/**
 * A dropdown menu with checkboxes.
 * @param title The title of the dropdown.
 * @param items The items to display in the dropdown.
 * @param setChecked A callback to be called when the checked state of an item changes.
 */
export function CheckboxDropdown({ title, items, setChecked }: Props) {
  const hasItemsOtherThanAllChecked = Object.entries(items).some(
    ([name, { checked }]) => name !== "All" && checked
  );

  function handleCheckedChange(name: string, checked: CheckedState) {
    const newItems = { ...items };

    if (name === "All") {
      // if all is checked, we cannot let the user uncheck it without having at least one other item checked
      if (!hasItemsOtherThanAllChecked) return;

      // if all is checked, uncheck all other items
      Object.keys(newItems).forEach((name) => {
        newItems[name].checked = false;
      });

      newItems["All"].checked = true;
      setChecked(newItems);

      return;
    }

    // if we are unchecking the only remaining checked item, check all
    if (!checked && isTheOnlyItemChecked(name)) {
      newItems[name].checked = false;
      newItems["All"].checked = true;

      setChecked(newItems);

      return;
    }

    // if we are checking an item, uncheck all
    newItems["All"].checked = false;
    newItems[name].checked = checked;

    setChecked(newItems);
  }

  function isTheOnlyItemChecked(name: string) {
    return (
      Object.entries(items).filter(
        ([key, { checked }]) => key !== name && checked
      ).length === 0
    );
  }

  return (
    <Root modal={false}>
      <Trigger>
        {title} <ChevronIcon />
      </Trigger>
      <Portal>
        <Content>
          {Object.entries(items).map(([name, { count, checked }]) => (
            <_CheckboxItem
              key={name}
              checked={checked}
              onCheckedChange={(checked) => handleCheckedChange(name, checked)}
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
                <ItemName>{name}</ItemName>
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
