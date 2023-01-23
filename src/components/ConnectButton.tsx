import { walletsAndConnectors } from "@/constants";
import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { connector } = useAccount();
  const [walletIcon, setWalletIcon] = useState("");

  const wallets = walletsAndConnectors.wallets.flatMap(
    ({ wallets }) => wallets
  );

  const iconsAndIds = wallets.map(({ id, iconBackground, iconUrl }) => ({
    id,
    iconBackground,
    iconUrl,
  }));

  useEffect(() => {
    void findIcon();

    async function findIcon() {
      const iconUrlOrGetter = iconsAndIds.find(
        ({ id }) => id === connector?.id
      )?.iconUrl;

      if (!iconUrlOrGetter) return;

      const iconUrl =
        typeof iconUrlOrGetter === "function"
          ? await iconUrlOrGetter()
          : iconUrlOrGetter;

      setWalletIcon(iconUrl);
    }
  }, [connector, iconsAndIds, walletIcon]);

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
        const ready = mounted;
        const connected = ready && account && chain;

        const wrapperStyle = {
          "--opacity": ready ? 1 : 0,
          "--pointer-events": ready ? "" : "none",
          "--user-select": ready ? "" : "none",
        } as CSSProperties;

        return (
          <Wrapper aria-hidden={!ready} style={wrapperStyle}>
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal}>Connect wallet</Button>
                );
              }

              if (chain.unsupported) {
                return <Button onClick={openChainModal}>Wrong network</Button>;
              }

              return (
                <Wrapper>
                  <Button onClick={openAccountModal}>
                    <NextImage
                      unoptimized
                      src={walletIcon}
                      width={25}
                      height={25}
                      alt="Connected wallet icon"
                    />
                    {account.displayName}
                  </Button>
                </Wrapper>
              );
            })()}
          </Wrapper>
        );
      }}
    </RainbowkitConnectButton.Custom>
  );
}

const Wrapper = styled.div`
  opacity: var(--opacity);
  pointer-events: var(--pointer-events);
  user-select: var(--user-select);
  transition: opacity var(--animation-duration);
`;

const Button = styled.button``;
