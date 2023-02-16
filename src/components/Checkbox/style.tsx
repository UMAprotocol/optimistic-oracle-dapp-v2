import { blueGrey700, white } from "@/constants";
import styled, { css } from "styled-components";
import { CheckboxState } from "@/types";

export const Box = styled.div<{ $checked: CheckboxState }>`
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  background: ${({ $checked }) => ($checked ? blueGrey700 : white)};
  border: 1px solid var(--blue-grey-700);
  border-radius: 4px;
  transition: background var(--animation-duration);
`;

export const NameAndBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ItemName = styled.span``;

export const ItemCount = styled.span`
  color: var(--blue-grey-400);
`;

export const checkboxItem = css`
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
