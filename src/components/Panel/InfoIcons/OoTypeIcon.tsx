import { PanelInfoIconText, PanelInfoIconWrapper } from "@/components/style";
import type { OracleType } from "@shared/types";
import OptimisticOracle from "public/assets/icons/optimistic-oracle.svg";

/**
 * Displays an icon for the given Optimistic Oracle type.
 * @param ooType The Optimistic Oracle type to display an icon for.
 * @returns The icon for the given Optimistic Oracle type, or null if the Optimistic Oracle type is not supported.
 */
export function OoTypeIcon({ ooType }: { ooType: OracleType | undefined }) {
  if (!ooType) return null;

  return (
    <PanelInfoIconWrapper>
      <OptimisticOracle className="w-6 h-3" />
      <PanelInfoIconText>{ooType}</PanelInfoIconText>
    </PanelInfoIconWrapper>
  );
}
