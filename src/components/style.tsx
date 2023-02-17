import { blueGrey700, white } from "@/constants";
import { CheckboxState } from "@/types";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import Chevron from "public/assets/icons/chevron.svg";
import styled, { css } from "styled-components";

export const DropdownChevronIcon = styled(Chevron)`
  path {
    stroke: currentColor;
    fill: var(--white);
  }
  transition: transform var(--animation-duration);
`;

export const DropdownRoot = styled(RadixDropdown.Root)``;

export const DropdownPortal = styled(RadixDropdown.Portal)``;

export const DropdownTrigger = styled(RadixDropdown.Trigger)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 45px;
  background: var(--white);
  text-transform: capitalize;
  font: var(--body-sm);
  color: var(--blue-grey-500);
  text-align: left;
  border: 1px solid var(--blue-grey-400);
  border-radius: 24px;
  padding-left: 18px;
  padding-right: 22px;
  &[data-state="open"] {
    ${DropdownChevronIcon} {
      transform: rotate(180deg);
    }
  }
`;

export const DropdownContent = styled(RadixDropdown.Content)`
  min-width: 220px;
  margin-top: 4px;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 24px;
  padding-bottom: 16px;
  font: var(--body-sm);
  color: var(--blue-grey-500);
  background: var(--white);
  border: 1px solid var(--blue-grey-400);
  border-radius: 4px;
`;

export const CheckboxBox = styled.div<{ $checked: CheckboxState }>`
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  background: ${({ $checked }) => ($checked ? blueGrey700 : white)};
  border: 1px solid var(--blue-grey-700);
  border-radius: 4px;
  transition: background var(--animation-duration);
`;

export const CheckboxNameAndBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CheckboxItemName = styled.span``;

export const CheckboxItemCount = styled.span`
  color: var(--blue-grey-400);
`;

export const checkboxItem = css`
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 12px;
  }

  &[data-disabled] {
    ${CheckboxItemName} {
      color: var(--blue-grey-400);
    }
    ${CheckboxBox} {
      border: 1px solid var(--blue-grey-400);
    }
  }
`;

export const PanelInfoIconWrapper = styled.div`
  height: 35px;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-inline: 10px;
  padding-block: 8px;
  border: 1px solid var(--grey-100);
  border-radius: 5px;
`;

export const PanelInfoIconText = styled.p`
  font: var(--body-xs);
`;
