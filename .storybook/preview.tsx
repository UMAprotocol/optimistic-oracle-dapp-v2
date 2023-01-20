import type { Decorator, Parameters } from "@storybook/react";
import React from "react";
import "../src/styles/fonts.css";
import { GlobalStyle } from "../src/components/GlobalStyle";

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
