import styled from "styled-components";
import { oracleQueryHover } from "../style";

export const TitleWrapper = styled.div``;

export const TitleIconWrapper = styled.div`
  width: 18px;
  height: 18px;
  margin-top: 2px;
`;

export const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 18px auto;
  gap: 8px;
  margin-bottom: 4px;
`;

export const TitleHeader = styled.h3`
  font: var(--body-sm);
  font-weight: 600;
`;

export const TitleText = styled.p`
  color: var(--blue-grey-500);
  font: var(--body-xs);
`;

export const ItemWrapper = styled.div`
  padding-inline: 16px;
  padding-block: 12px;
  background: var(--white);
  border-radius: 4px;

  ${oracleQueryHover}
`;

export const ItemInnerWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 16px;
  gap: 4px;
  padding-bottom: 8px;
  margin-bottom: 4px;
`;

export const ClickableIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  margin-top: 2px;
`;

export const ItemDetailsWrapper = styled.div``;

export const ItemDetailsInnerWrapper = styled.div`
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--grey-500);
`;

export const ItemDetailsText = styled.p`
  font: var(--body-xs);
`;
