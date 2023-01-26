import {
  CheckboxItem,
  Content,
  DropdownMenuCheckboxItemProps,
  ItemIndicator,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

export type CheckedState = DropdownMenuCheckboxItemProps["checked"];

export type Item = {
  checked: CheckedState;
  count: number;
};

export type Items = Record<string, Item>;

interface Props {
  items: Items;
  setChecked: Dispatch<SetStateAction<Items>>;
}
export function CheckboxDropdown({ items, setChecked }: Props) {
  const hasItemsOtherThanAllChecked = Object.entries(items).some(
    ([name, { checked }]) => name !== "all" && checked
  );

  function handleCheckedChange(name: string, checked: CheckedState) {
    const newItems = { ...items };

    if (name === "all") {
      // if all is checked, we cannot let the user uncheck it without having at least one other item checked
      if (!hasItemsOtherThanAllChecked) return;

      // if all is checked, uncheck all other items
      Object.keys(newItems).forEach((name) => {
        newItems[name].checked = false;
      });
      newItems["all"].checked = true;
      setChecked(newItems);
      return;
    }

    // if we are unchecking the only remaining checked item, check all
    if (!checked && isTheOnlyItemChecked(name)) {
      newItems[name].checked = false;
      newItems["all"].checked = true;
      setChecked(newItems);
      return;
    }

    // if we are checking an item, uncheck all
    newItems.all.checked = false;
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
    <Root defaultOpen={true}>
      <Trigger>Trigger</Trigger>
      <Portal>
        <Content>
          {Object.entries(items).map(([name, { count, checked }]) => (
            <CheckboxItem
              key={name}
              checked={checked}
              onCheckedChange={(checked) => handleCheckedChange(name, checked)}
              onSelect={(e) => e.preventDefault()}
            >
              <ItemIndicator>✅</ItemIndicator>
              <ItemName>{name}</ItemName>
              <ItemCount>{count}</ItemCount>
            </CheckboxItem>
          ))}
        </Content>
      </Portal>
    </Root>
  );
}

const ItemName = styled.span`
  text-transform: capitalize;
`;

const ItemCount = styled.span``;
