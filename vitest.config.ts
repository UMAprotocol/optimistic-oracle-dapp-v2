import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/*.e2e.ts",
      "**/libs/**",
    ],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@libs": path.resolve(__dirname, "./libs/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  // Mock SVG imports as empty React components
  plugins: [
    {
      name: "svg-mock",
      resolveId(id) {
        if (id.endsWith(".svg")) {
          return id;
        }
      },
      load(id) {
        if (id.endsWith(".svg")) {
          return "export default () => null;";
        }
      },
    },
  ],
});
