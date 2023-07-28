import type { Config } from "tailwindcss";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      white: "hsl(var(--color-white) / <alpha-value>)",
      "red-100": "hsl(var(--color-red-100) / <alpha-value>)",
      "red-500": "hsl(var(--color-red-500) / <alpha-value>)",
      "red-600": "hsl(var(--color-red-600) / <alpha-value>)",
      "grey-50": "hsl(var(--color-grey-50) / <alpha-value>)",
      "grey-100": "hsl(var(--color-grey-100) / <alpha-value>)",
      "grey-400": "hsl(var(--color-grey-400) / <alpha-value>)",
      "grey-500": "hsl(var(--color-grey-500) / <alpha-value>)",
      "grey-900": "hsl(var(--color-grey-900) / <alpha-value>)",
      dark: "hsl(var(--color-dark-text) / <alpha-value>)",
      light: "hsl(var(--color-light-text) / <alpha-value>)",
      "blue-grey-300": "hsl(var(--color-blue-grey-300) / <alpha-value>)",
      "blue-grey-400": "hsl(var(--color-blue-grey-400) / <alpha-value>)",
      "blue-grey-500": "hsl(var(--color-blue-grey-500) / <alpha-value>)",
      "blue-grey-600": "hsl(var(--color-blue-grey-600) / <alpha-value>)",
      "blue-grey-700": "hsl(var(--color-blue-grey-700) / <alpha-value>)",
    },
    fontFamily: {
      sans: ["Halyard Display", "sans-serif"],
    },
    transitionDuration: {
      DEFAULT: "var(--animation-duration)",
    },
    extend: {
      spacing: {
        "page-padding": "var(--page-padding)",
        "panel-width": "var(--panel-width)",
        "panel-content-width": "var(--panel-content-width)",
      },
    },
  },
  plugins: [],
} satisfies Config;
