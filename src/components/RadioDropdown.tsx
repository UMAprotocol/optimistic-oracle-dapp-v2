import {
  DropdownChevronIcon,
  DropdownContent,
  DropdownPortal,
  DropdownRoot,
  DropdownTrigger,
} from "@/components/style";
import type { DropdownItem } from "@/types";
import { RadioItem } from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";

interface Props {
  items: DropdownItem[] | undefined;
  selected: DropdownItem | undefined;
  onSelect: ((item: DropdownItem) => void) | undefined;
  disabled?: boolean;
}
/**
 * Dropdown menu with radio items
 * @param items - the items to show in the dropdown
 * @param selected - the selected item
 * @param onSelect - the callback to call when an item is selected
 */
export function RadioDropdown({ items, selected, onSelect, disabled }: Props) {
  if (!items || !onSelect) return null;

  return (
    <DropdownRoot modal={false}>
      <_Trigger disabled={disabled}>
        {selected?.label ?? "Select option"} <DropdownChevronIcon />
      </_Trigger>
      <DropdownPortal>
        <_Content align="start" side="bottom" sideOffset={4}>
          {items.map((item) => (
            <_RadioItem
              key={item.value}
              value={item.value.toString()}
              onSelect={() => onSelect(item)}
            >
              {item.label}
              {item.secondaryLabel && (
                <SecondaryLabel>({item.secondaryLabel})</SecondaryLabel>
              )}
            </_RadioItem>
          ))}
        </_Content>
      </DropdownPortal>
    </DropdownRoot>
  );
}

const _Trigger = styled(DropdownTrigger)`
  min-height: 40px;
  border-radius: 4px;
  gap: 12px;
`;

const _Content = styled(DropdownContent)`
  padding-block: 0;
`;

const _RadioItem = styled(RadioItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding-left: 18px;
  padding-right: 18px;
`;

const SecondaryLabel = styled.span`
  color: var(--blue-grey-300);
`;
