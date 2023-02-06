import { IconWrapper } from "@/components";
import { OracleType } from "@/types";
import OptimisticOracle from "public/assets/icons/optimistic-oracle.svg";
import styled from "styled-components";
import { InfoIconText, InfoIconWrapper } from "./styles";

/**
 * Displays an icon for the given Optimistic Oracle type.
 * @param ooType The Optimistic Oracle type to display an icon for.
 * @returns The icon for the given Optimistic Oracle type, or null if the Optimistic Oracle type is not supported.
 */
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
