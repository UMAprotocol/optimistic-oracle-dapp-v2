import { ChainNameAndIcon, TruncatedTitle } from "@/components";
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
  const isKnownProject = project !== "Unknown";

  return (
    <TitleWrapper>
      <HeaderWrapper>
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
