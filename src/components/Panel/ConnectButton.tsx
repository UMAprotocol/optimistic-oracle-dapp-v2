import { red500 } from "@/constants";
import { scaleLightnessHsla } from "@/helpers";
import { useWalletIcon } from "@/hooks";
import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit";
import NextImage from "next/image";
import Warning from "public/assets/icons/warning.svg";
import { CSSProperties } from "react";
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
                  <ButtonSecondary onClick={openChainModal}>
                    <WarningIcon />
                    Wrong network
                  </ButtonSecondary>
                );
              }

              return (
                <>
                  <AddressWrapper>
                    {walletIcon && (
                      <Image
                        unoptimized
                        src={walletIcon}
                        width={15}
                        height={15}
                        alt="Connected wallet icon"
                      />
                    )}
                    <AddressText>{account.address}</AddressText>
                  </AddressWrapper>
                  <ButtonSecondary onClick={openAccountModal}>
                    Disconnect
                  </ButtonSecondary>
                </>
              );
            })()}
          </Wrapper>
        );
      }}
    </RainbowkitConnectButton.Custom>
  );
}
const Image = styled(NextImage)`
  border-radius: 50%;
`;

const Wrapper = styled.div`
  pointer-events: var(--pointer-events);
  user-select: var(--user-select);
`;

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-block: 12px;
`;

const AddressText = styled.span`
  font: var(--body-xs);
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  padding-inline: 32px;
  padding-block: 8px;
  border-radius: 4px;
  font: var(--body-sm);
  color: var(--white);
  background: var(--red-500);
  transition: filter var(--animation-duration);

  &:hover {
    filter: brightness(1.2);
  }
`;

const ButtonSecondary = styled(Button)`
  background: var(--white);
  border: 1px solid var(--red-500);
  color: var(--red-500);
  transition: background var(--animation-duration);

  &:hover {
    filter: unset;
    background: ${scaleLightnessHsla(red500, 1.5)};
  }
`;

const WarningIcon = styled(Warning)`
  width: 16px;
`;
