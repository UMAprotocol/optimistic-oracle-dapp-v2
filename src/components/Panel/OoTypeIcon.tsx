import { IconWrapper } from "@/components";
import { OracleType } from "@/types";
import OptimisticOracle from "public/assets/icons/optimistic-oracle.svg";
import styled from "styled-components";
import { InfoIconText, InfoIconWrapper } from "./styles";

export function OoTypeIcon({ ooType }: { ooType: OracleType | undefined }) {
  if (!ooType) return null;

  return (
    <InfoIconWrapper>
      <IconWrapper width={24} height={12}>
        <OoIcon />
      </IconWrapper>
      <InfoIconText>{ooType}</InfoIconText>
    </InfoIconWrapper>
  );
}

const OoIcon = styled(OptimisticOracle)``;
