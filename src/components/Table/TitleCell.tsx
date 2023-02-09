import { projectIcons } from "@/constants";
import { OracleQueryUI } from "@/types";
import Uma from "public/assets/icons/projects/uma.svg";
import styled from "styled-components";
import {
  IconWrapper,
  TextWrapper,
  TitleHeader,
  TitleTD,
  TitleText,
  TitleWrapper,
} from "./style";

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

const UmaIcon = styled(Uma)``;
