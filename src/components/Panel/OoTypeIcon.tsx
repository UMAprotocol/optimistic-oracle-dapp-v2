import { IconWrapper } from "@/components";
import { PanelInfoIconText, PanelInfoIconWrapper } from "@/components/style";
import { OracleType } from "@/types";
import OptimisticOracle from "public/assets/icons/optimistic-oracle.svg";
import styled from "styled-components";

/**
 * Displays an icon for the given Optimistic Oracle type.
 * @param ooType The Optimistic Oracle type to display an icon for.
 * @returns The icon for the given Optimistic Oracle type, or null if the Optimistic Oracle type is not supported.
 */
export function OoTypeIcon({ ooType }: { ooType: OracleType | undefined }) {
  if (!ooType) return null;

  return (
    <PanelInfoIconWrapper>
      <IconWrapper width={24} height={12}>
        <OoIcon />
      </IconWrapper>
      <PanelInfoIconText>{ooType}</PanelInfoIconText>
    </PanelInfoIconWrapper>
  );
}

const OoIcon = styled(OptimisticOracle)``;
