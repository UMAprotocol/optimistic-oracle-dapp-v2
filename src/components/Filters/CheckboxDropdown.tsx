import { blueGrey700, white } from "@/constants";
import {
  CheckboxItem,
  Content,
  DropdownMenuCheckboxItemProps,
  ItemIndicator,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import Check from "public/assets/icons/check.svg";
import Chevron from "public/assets/icons/chevron.svg";
import { Dispatch, ReactNode, SetStateAction } from "react";
import styled, { CSSProperties } from "styled-components";

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
    <Root>
      <_Trigger>
        {title} <ChevronIcon />
      </_Trigger>
      <Portal>
        <_Content>
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
        </_Content>
      </Portal>
    </Root>
  );
}

const ChevronIcon = styled(Chevron)`
  path {
    stroke: currentColor;
    fill: var(--white);
  }
  transition: transform var(--animation-duration);
`;

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

const _Trigger = styled(Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 220px;
  min-height: 45px;
  background: var(--white);
  font: var(--body-sm);
  color: var(--blue-grey-500);
  text-align: left;
  border: 1px solid var(--blue-grey-400);
  border-radius: 24px;
  padding-left: 18px;
  padding-right: 22px;
  &[data-state="open"] {
    ${ChevronIcon} {
      transform: rotate(180deg);
    }
  }
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

const _Content = styled(Content)`
  font: var(--body-sm);
  color: var(--blue-grey-500);
  min-width: 220px;
  margin-top: 4px;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 24px;
  padding-bottom: 16px;
  border: 1px solid var(--blue-grey-400);
  border-radius: 4px;
`;
