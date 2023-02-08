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
  const projectIcon =
    project && project in projectIcons ? projectIcons[project] : <UmaIcon />;

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
  gap: var(--gap);
`;

const TitleHeader = styled.h3`
  max-width: min(500px, 50vw);
  font: var(--body-sm);
  font-weight: 600;
  transition: color var(--animation-duration);
`;

const IconWrapper = styled.div`
  width: clamp(24px, 3vw, 40px);
  aspect-ratio: 1;
`;

const TextWrapper = styled.div``;

const TitleText = styled.p`
  margin-top: 4px;
  font: var(--body-xs);
`;

const UmaIcon = styled(Uma)``;
