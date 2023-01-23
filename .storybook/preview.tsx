import type { Decorator, Parameters } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";
import "../src/styles/fonts.css";
import { globalStyleDecorator, makeMockWagmiDecorator } from "./decorators";

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
  globalStyleDecorator,
  makeMockWagmiDecorator(),
];
