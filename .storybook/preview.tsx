import type { Decorator, Parameters } from "@storybook/react";
import { GlobalStyle } from "../src/components/GlobalStyle";
import React from "react";

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
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];
