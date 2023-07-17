import type { CheckboxState } from "@/types";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import Chevron from "public/assets/icons/chevron.svg";
import Clickable from "public/assets/icons/clickable.svg";
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
  min-height: 44px;
  background: var(--white);
  font: var(--body-sm);
  color: var(--blue-grey-500);
  text-align: left;
  border: 1px solid var(--blue-grey-400);
  border-radius: 4px;
  padding-left: 18px;
  padding-right: 22px;
  &[data-state="open"] {
    ${DropdownChevronIcon} {
      transform: rotate(180deg);
    }
  }
  &[data-disabled] {
    opacity: 0.25;
  }
`;

export const DropdownContent = styled(RadixDropdown.Content)`
  width: var(--radix-dropdown-menu-trigger-width);
  margin-top: 4px;
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
  background: ${({ $checked }) =>
    $checked ? "var(--blue-grey-700)" : "var(--white)"};
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
  gap: 8px;
  width: 100%;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 24px;
  padding-bottom: 12px;

  &:is(:first-child) {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:is(:last-child) {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:focus,
  &:hover {
    outline: none;
    background: var(--grey-500);
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
  border: 1px solid var(--grey-400);
  border-radius: 5px;
`;

export const PanelInfoIconText = styled.p`
  font: var(--body-xs);
`;

export const OracleQueryClickableIcon = styled(Clickable)`
  transition: fill var(--animation-duration);

  path {
    transition: stroke var(--animation-duration);
  }
`;

export const oracleQueryHover = css`
  &:hover {
    h3 {
      transition: color var(--animation-duration);
      color: var(--red-500);
    }

    ${OracleQueryClickableIcon} {
      fill: var(--red-500);

      path {
        stroke: var(--white);
      }
    }
  }
`;
