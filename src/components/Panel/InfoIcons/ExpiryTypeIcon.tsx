import { PanelInfoIconText, PanelInfoIconWrapper } from "@/components/style";
import type { ExpiryType } from "@shared/types";
import Clock from "public/assets/icons/clock.svg";

/**
 * Displays an icon for the given expiry type.
 * @param expiryType The expiry type to display an icon for.
 * @returns The icon for the given expiry type, or null if the expiry type is not supported.
 */
export function ExpiryTypeIcon({
  expiryType,
}: {
  expiryType: ExpiryType | undefined;
}) {
  if (!expiryType) return null;

  return (
    <PanelInfoIconWrapper>
      <div className="w-6 h-6 grid place-items-center bg-grey-400 rounded-full">
        <Clock className="[&>path]:stroke-dark-text" />
      </div>
      <PanelInfoIconText>{expiryType} Expiry</PanelInfoIconText>
    </PanelInfoIconWrapper>
  );
}
