import { walletsAndConnectors } from "@/constants";
import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
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

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    <img src={walletIcon} />
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowkitConnectButton.Custom>
  );
}
