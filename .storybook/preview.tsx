import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Decorator, Parameters } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import React from "react";
import { mockDateDecorator } from "storybook-mock-date-decorator";
import { WagmiConfig } from "wagmi";
import {
  chains,
  rainbowKitTheme,
  wagmiClient,
} from "../src/components/WalletConfig";
import { NotificationsProvider } from "../src/contexts";
import { mockDate } from "../src/stories/mocks";
import "../src/styles/fonts.css";
import "../src/styles/globals.css";
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
  date: mockDate,
  nextjs: {
    appDirectory: true,
  },
};

export const decorators: Decorator[] = [
  mockDateDecorator,
  mswDecorator,
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
