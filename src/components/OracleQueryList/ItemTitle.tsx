import { ChainNameAndIcon, TruncatedTitle } from "@/components";
import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import { HeaderWrapper, TitleHeader, TitleText, TitleWrapper } from "./style";

export function ItemTitle({
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
    <TitleWrapper>
      <HeaderWrapper>
        <ProjectIcon className="w-[18px] h-[18px] mt-[2px]" />
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
