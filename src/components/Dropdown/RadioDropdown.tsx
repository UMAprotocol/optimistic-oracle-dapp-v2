import { RadioItem } from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { ChevronIcon, Content, Portal, Root, Trigger } from "./style";

type Item = {
  label: string;
  value: string | number;
};

interface Props {
  items: Item[];
  selected: Item;
  onSelect: (item: Item) => void;
}
export function RadioDropdown({ items, selected, onSelect }: Props) {
  return (
    <Root>
      <_Trigger>
        {selected.label} <ChevronIcon />
      </_Trigger>
      <Portal>
        <_Content>
          {items.map((item) => (
            <_RadioItem
              key={item.value}
              value={item.value.toString()}
              onSelect={() => onSelect(item)}
            >
              {item.label}
            </_RadioItem>
          ))}
        </_Content>
      </Portal>
    </Root>
  );
}

const _Trigger = styled(Trigger)`
  border-radius: 4px;
  min-width: 128px;
  width: fit-content;
  gap: 12px;
`;

const _Content = styled(Content)`
  min-width: 128px;
  width: fit-content;
  padding-block: 0;
`;

const _RadioItem = styled(RadioItem)`
  width: 100%;
  margin-block: 8px;
`;
