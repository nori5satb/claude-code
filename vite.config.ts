import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => ({
  plugins: [
    ...(mode !== "test" ? [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      reactRouter(),
    ] : []),
    tailwindcss(),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
}));
