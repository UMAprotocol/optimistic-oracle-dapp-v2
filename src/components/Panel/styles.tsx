import styled from "styled-components";

export const InfoIconWrapper = styled.div`
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

export const InfoIconText = styled.p`
  font: var(--body-xs);
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

export const SectionTitleText = styled.h2`
  font: var(--body-md);
  font-weight: 700;
`;
