import { CloseButton, ErrorMessage } from "@/components";
import { mobileAndUnder, tabletAndUnder } from "@/constants";
import Warning from "public/assets/icons/warning.svg";
import styled from "styled-components";
import { useIsClient, useLocalStorage } from "usehooks-ts";

export function LegacyDappLinkBanner() {
  const [showBanner, setShowBanner] = useLocalStorage(
    "show-legacy-dapp-banner",
    true,
  );
  const isClient = useIsClient();

  if (!showBanner || !isClient) return null;

  function hideBanner() {
    setShowBanner(false);
  }

  return (
    <Wrapper>
      <MessageWrapper>
        <InfoIcon />
        <ErrorMessage
          text="Welcome to the new Oracle Dapp"
          link={{
            text: "View the legacy Dapp here",
            href: "https://legacy.oracle.uma.xyz",
          }}
        />
        <CloseButtonWrapper>
          <CloseButton onClick={hideBanner} />
        </CloseButtonWrapper>
      </MessageWrapper>
    </Wrapper>
  );
}

export const Wrapper = styled.div`
  background: var(--blue-grey-600);
  max-width: 100vw;
  color: var(--light-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block: 16px;
  padding-inline: var(--page-padding);

  @media ${mobileAndUnder} {
    padding-block: 8px;
  }
`;

export const MessageWrapper = styled.div`
  width: 100%;
  max-width: var(--page-width);
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-block: 4px;
  &:not(:last-child) {
    margin-bottom: 4px;
  }

  @media ${tabletAndUnder} {
    padding-inline: 0;
  }
`;

export const InfoIcon = styled(Warning)`
  path {
    fill: var(--white);
    stroke: var(--blue-grey-600);
  }

  --icon-size: 24px;
  width: var(--icon-size);

  @media ${tabletAndUnder} {
    --icon-size: 20px;
  }

  @media ${mobileAndUnder} {
    --icon-size: 16px;
  }
`;

const CloseButtonWrapper = styled.div`
  margin-left: auto;
`;
