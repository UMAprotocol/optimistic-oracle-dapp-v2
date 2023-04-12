import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { ChainIcon } from "./ChainIcon";
import { ExpiryTypeIcon } from "./ExpiryTypeIcon";
import { OoTypeIcon } from "./OoTypeIcon";

export function InfoIcons({ chainId, oracleType, expiryType }: OracleQueryUI) {
  return (
    <InfoIconsWrapper>
      <ChainIcon chainId={chainId} />
      <OoTypeIcon ooType={oracleType} />
      {expiryType && <ExpiryTypeIcon expiryType={expiryType} />}
    </InfoIconsWrapper>
  );
}

const InfoIconsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  padding-inline: var(--padding-inline);
  margin-bottom: 42px;
`;
