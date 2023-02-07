import { projectIcons } from "@/constants";
import { OracleQueryUI } from "@/types";
import Uma from "public/assets/icons/projects/uma.svg";
import styled from "styled-components";
import { TD } from "./style";

export function TitleCell({
  title,
  project,
  chainName,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const projectIcon = project ? projectIcons[project] : <UmaIcon />;

  return (
    <TitleTD>
      <TitleWrapper>
        <IconWrapper>{projectIcon}</IconWrapper>
        <TextWrapper>
          <TitleHeader>{title}</TitleHeader>
          <TitleText>
            {project} | {timeFormatted} | {chainName}{" "}
            {expiryType && `| ${expiryType}`}
          </TitleText>
        </TextWrapper>
      </TitleWrapper>
    </TitleTD>
  );
}
const TitleTD = styled(TD)``;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-left: 20px;
`;

const TitleHeader = styled.h3`
  max-width: 500px;
  font: var(--body-sm);
  font-weight: 600;
  transition: color var(--animation-duration);
`;

const IconWrapper = styled.div``;

const TextWrapper = styled.div``;

const TitleText = styled.p`
  margin-top: 4px;
  font: var(--body-xs);
`;

const UmaIcon = styled(Uma)``;
