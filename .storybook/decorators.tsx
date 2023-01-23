import { Decorator } from "@storybook/react";
import React from "react";
import { WagmiConfig } from "wagmi";
import { GlobalStyle } from "../src/components/GlobalStyle";
import { wagmiClient } from "../src/pages/_app";
import { mockWagmiClient, mockWallet } from "./mocks";

export const globalStyleDecorator: Decorator = (Story) => (
  <>
    <GlobalStyle />
    <Story />
  </>
);

export const WagmiDecorator: Decorator = (Story) => (
  <WagmiConfig client={wagmiClient}>
    <Story />
  </WagmiConfig>
);

export function makeMockWagmiDecorator(wallet = mockWallet): Decorator {
  return (Story) => (
    <WagmiConfig client={mockWagmiClient(wallet)}>
      <Story />
    </WagmiConfig>
  );
}
