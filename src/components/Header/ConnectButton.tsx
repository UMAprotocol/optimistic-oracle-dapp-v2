import { blueGrey600 } from "@/constants";
import { useWalletIcon } from "@/hooks";
import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextImage from "next/image";
import Chevron from "public/assets/icons/chevron.svg";
import Warning from "public/assets/icons/warning.svg";
import type { CSSProperties } from "react";
import styled from "styled-components";

export function ConnectButton() {
  const walletIcon = useWalletIcon();

  return (
    <RainbowkitConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && !!account && !!chain;

        const wrapperStyle = {
          "--pointer-events": mounted ? "" : "none",
          "--user-select": mounted ? "" : "none",
        } as CSSProperties;

        return (
          <Wrapper style={wrapperStyle}>
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>Connect wallet</Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <WrongNetworkButton onClick={openChainModal}>
                    <WarningIcon />
                    Wrong network
                  </WrongNetworkButton>
                );
              }

              return (
                <Button
                  onClick={openAccountModal}
                  style={
                    {
                      "--justify-content": "space-between",
                      "--background": blueGrey600,
                    } as CSSProperties
                  }
                >
                  <ButtonInnerWrapper>
                    {walletIcon && (
                      <Image
                        unoptimized
                        src={walletIcon}
                        width={25}
                        height={25}
                        alt="Connected wallet icon"
                      />
                    )}
                    {account.displayName}
                  </ButtonInnerWrapper>
                  <ChevronIcon />
                </Button>
              );
            })()}
          </Wrapper>
        );
      }}
    </RainbowkitConnectButton.Custom>
  );
}

const Wrapper = styled.div`
  pointer-events: var(--pointer-events);
  user-select: var(--user-select);
`;

const Image = styled(NextImage)`
  border-radius: 50%;
`;

const ButtonInnerWrapper = styled.div`
  color: inherit;
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: var(--justify-content, center);
  height: 45px;
  min-width: 190px;
  width: 100%;
  padding-inline: 20px;
  border-radius: 4px;
  font: var(--body-sm);
  color: var(--white);
  background: var(--background, var(--red-500));
  transition: filter var(--animation-duration);

  &:hover {
    filter: brightness(1.2);
  }
`;

const WrongNetworkButton = styled(Button)`
  gap: 8px;
`;

const ChevronIcon = styled(Chevron)``;

const WarningIcon = styled(Warning)`
  width: 16px;
  path {
    fill: var(--white);
    stroke: var(--red-500);
  }
`;
