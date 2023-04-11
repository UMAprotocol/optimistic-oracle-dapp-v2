import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import { TruncatedTitle } from "../TruncatedTitle";
import {
  IconWrapper,
  TextWrapper,
  TitleHeader,
  TitleTD,
  TitleText,
  TitleWrapper,
} from "./style";

/**
 * Renders the title cell for a table row
 * This is the first cell in the row
 * It shows the title, project, time, and chain name
 * @param title - the title of the query
 * @param project - the project of the query
 * @param chainName - the chain name of the query
 * @param timeFormatted - the time of the query
 * @param expiryType - the expiry type of the query
 */
export function TitleCell({
  title,
  project,
  chainName,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const projectIcon = getProjectIcon(project);
  const isKnownProject = project !== "Unknown";

  return (
    <TitleTD>
      <TitleWrapper>
        <IconWrapper>{projectIcon}</IconWrapper>
        <TextWrapper>
          <TitleHeader>
            <TruncatedTitle title={title} />
          </TitleHeader>
          <TitleText>
            {isKnownProject && `${project} | `}
            {timeFormatted} | {chainName} {expiryType && `| ${expiryType}`}
          </TitleText>
        </TextWrapper>
      </TitleWrapper>
    </TitleTD>
  );
}
