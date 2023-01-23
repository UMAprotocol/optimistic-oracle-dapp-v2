import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Decorator, Parameters } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import React from "react";
import { WagmiConfig } from "wagmi";
import { GlobalStyle } from "../src/components/GlobalStyle";
import { wagmiClient, chains } from "../src/pages/_app";
import "../src/styles/fonts.css";

initialize();

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorator[] = [
  // @ts-expect-error mswDecorator has not updated to the storybook v7 types
  mswDecorator,
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
  (Story) => (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Story />
      </RainbowKitProvider>
    </WagmiConfig>
  ),
];
