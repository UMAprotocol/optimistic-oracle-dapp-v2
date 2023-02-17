import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";

export function ItemTitle({
  title,
  project,
  chainName,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const projectIcon = getProjectIcon(project);

  return (
    <Wrapper>
      <TitleWrapper>
        <IconWrapper>{projectIcon}</IconWrapper>
        <TitleHeader>{title}</TitleHeader>
      </TitleWrapper>
      <TitleText>
        {project} | {timeFormatted} | {chainName}{" "}
        {expiryType && `| ${expiryType}`}
      </TitleText>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  margin-top: 2px;
`;

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 18px auto;
  gap: 8px;
`;

const TitleHeader = styled.h3`
  font: var(--body-sm);
  font-weight: 600;
`;

const TitleText = styled.p`
  color: var(--blue-grey-500);
  font: var(--body-xs);
`;
