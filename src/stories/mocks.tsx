import { MockConnector } from "@wagmi/core/connectors/mock";
import { Wallet } from "ethers";
import { createClient } from "wagmi";
import { chains, provider } from "../pages/_app";

export const mockAddress =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export const mockWallet = new Wallet(mockAddress);

export const mockWagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MockConnector({
      chains,
      options: {
        signer: mockWallet,
        chainId: 1,
      },
    }),
  ],
});
