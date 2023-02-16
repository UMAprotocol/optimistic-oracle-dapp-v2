import { InfoIconText, InfoIconWrapper } from "@/components/style";
import { ExpiryType } from "@/types";
import Clock from "public/assets/icons/clock.svg";
import styled from "styled-components";

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
    <InfoIconWrapper>
      <ClockIconWrapper>
        <ClockIcon />
      </ClockIconWrapper>
      <InfoIconText>{expiryType} Expiry</InfoIconText>
    </InfoIconWrapper>
  );
}

const ClockIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  background: var(--grey-400);
  border-radius: 50%;
`;

const ClockIcon = styled(Clock)`
  path {
    stroke: var(--dark-text);
  }
`;
