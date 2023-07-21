import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import { ChainNameAndIcon } from "../ChainNameAndIcon";
import { TruncatedTitle } from "../TruncatedTitle";
import {
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
  chainId,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const ProjectIcon = getProjectIcon(project);
  const isKnownProject = project !== "Unknown";

  return (
    <TitleTD>
      <TitleWrapper>
        <ProjectIcon className="w-[clamp(24px,3vw,40px)] h-[clamp(24px,3vw,40px)] min-w-[24px]" />
        <TextWrapper>
          <TitleHeader>
            <TruncatedTitle title={title} />
          </TitleHeader>
          <TitleText>
            {isKnownProject && `${project} | `}
            {timeFormatted} |{" "}
            <ChainNameAndIcon chainId={chainId} chainName={chainName} />{" "}
            {expiryType && `| ${expiryType}`}
          </TitleText>
        </TextWrapper>
      </TitleWrapper>
    </TitleTD>
  );
}
