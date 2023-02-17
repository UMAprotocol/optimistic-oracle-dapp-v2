import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import {
  HeaderWrapper,
  TitleHeader,
  TitleIconWrapper,
  TitleText,
  TitleWrapper,
} from "./style";

export function ItemTitle({
  title,
  project,
  chainName,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const projectIcon = getProjectIcon(project);

  return (
    <TitleWrapper>
      <HeaderWrapper>
        <TitleIconWrapper>{projectIcon}</TitleIconWrapper>
        <TitleHeader>{title}</TitleHeader>
      </HeaderWrapper>
      <TitleText>
        {project} | {timeFormatted} | {chainName}{" "}
        {expiryType && `| ${expiryType}`}
      </TitleText>
    </TitleWrapper>
  );
}
