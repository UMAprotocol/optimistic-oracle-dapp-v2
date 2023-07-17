import type { Config } from "tailwindcss";

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./public/**/*.{css,svg}"],
  theme: {
    fontFamily: {
      sans: ["Halyard Display", "sans-serif"],
    },
    transitionDuration: {
      DEFAULT: "var(--animation-duration)",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
