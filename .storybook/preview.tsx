import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Decorator, Parameters } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import React from "react";
import { WagmiConfig } from "wagmi";
import { GlobalStyle } from "../src/components/GlobalStyle";
import { NotificationsProvider } from "../src/contexts";
import { chains, rainbowKitTheme, wagmiClient } from "../src/pages/_app";
import "../src/styles/fonts.css";
import "./rainbow.css";

initialize({
  onUnhandledRequest: "bypass",
});

export const parameters: Parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  viewport: {
    defaultViewport: "desktop",
    viewports: {
      smallMobile: {
        name: "Small Mobile",
        styles: {
          height: "100%",
          width: "320px",
        },
        type: "mobile",
      },
      largeMobile: {
        name: "Large Mobile",
        styles: {
          height: "100%",
          width: "640px",
        },
        type: "mobile",
      },
      tablet: {
        name: "Tablet",
        styles: {
          height: "100%",
          width: "1024px",
        },
        type: "tablet",
      },
      laptop: {
        name: "Laptop",
        styles: {
          height: "100%",
          width: "1300px",
        },
        type: "desktop",
      },
      desktop: {
        name: "Desktop",
        styles: {
          height: "100%",
          width: "100%",
        },
        type: "desktop",
      },
    },
  },
  defaultViewport: "mobile",
  layout: "fullscreen",
  chromatic: {
    viewports: [320, 640, 1024, 1300, 1920],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators: Decorator[] = [
  mswDecorator,
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
  (Story) => (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        <NotificationsProvider>
          <Story />
        </NotificationsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  ),
];
