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
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/v3/") })],
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["localhost", "127.0.0.1", "terminal.local"],
    },
  },
});
