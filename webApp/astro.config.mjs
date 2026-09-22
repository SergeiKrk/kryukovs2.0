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
  redirects: {
    "/v3/": "/",
    "/v2/": "/",
    "/v2/services/web-development/": "/#services",
    "/v2/services/react-apps/": "/#services",
    "/v2/services/calculators/": "/#services",
    "/v2/services/telegram-mini-apps/": "/#services",
    "/v2/services/site-support/": "/#services",
    "/v2/services/seo-audit/": "/#services",
    "/services/": "/#services",
    "/services/web-development/": "/#services",
    "/services/react-apps/": "/#services",
    "/services/calculators/": "/#services",
    "/services/telegram-mini-apps/": "/#services",
    "/services/site-support/": "/#services",
    "/services/seo-audit/": "/#services",
    "/contacts/": "/#calculator",
  },
  integrations: [react(), sitemap({ filter: (page) => page !== "https://kryukovs.ru/" && !page.includes("/v3/") && !page.includes("/messengers/") })],
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["localhost", "127.0.0.1", "terminal.local"],
    },
  },
});
