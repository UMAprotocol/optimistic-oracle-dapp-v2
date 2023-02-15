import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import Chevron from "public/assets/icons/chevron.svg";
import styled from "styled-components";

export const ChevronIcon = styled(Chevron)`
  path {
    stroke: currentColor;
    fill: var(--white);
  }
  transition: transform var(--animation-duration);
`;

export const Root = styled(RadixDropdown.Root)``;

export const Portal = styled(RadixDropdown.Portal)``;

export const Trigger = styled(RadixDropdown.Trigger)`
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
    ${ChevronIcon} {
      transform: rotate(180deg);
    }
  }
`;

export const Content = styled(RadixDropdown.Content)`
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
