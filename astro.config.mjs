import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://kryukovs.ru",
  output: "static",
  trailingSlash: "always",
  build: {
    inlineStylesheets: "always",
  },
  integrations: [react(), sitemap()],
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["localhost", "127.0.0.1", "terminal.local"],
    },
  },
});
