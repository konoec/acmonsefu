import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://acmonsefu.com",
  integrations: [sitemap()],
  redirects: {
    "/servicios": "/proyectos",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});