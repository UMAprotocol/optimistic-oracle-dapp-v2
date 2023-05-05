import { ChainNameAndIcon, TruncatedTitle } from "@/components";
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
  chainId,
  timeFormatted,
  expiryType,
}: OracleQueryUI) {
  const projectIcon = getProjectIcon(project);
  const isKnownProject = project !== "Unknown";

  return (
    <TitleWrapper>
      <HeaderWrapper>
        <TitleIconWrapper>{projectIcon}</TitleIconWrapper>
        <TitleHeader>
          <TruncatedTitle title={title} />
        </TitleHeader>
      </HeaderWrapper>
      <TitleText>
        {isKnownProject && `${project} | `}
        {timeFormatted} |{" "}
        <ChainNameAndIcon chainId={chainId} chainName={chainName} />{" "}
        {expiryType && `| ${expiryType}`}
      </TitleText>
    </TitleWrapper>
  );
}
