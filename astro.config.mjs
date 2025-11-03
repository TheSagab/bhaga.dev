import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bhaga.dev",
  integrations: [mdx(), sitemap(), pagefind()],
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    fonts: [
      {
        name: "Plus Jakarta Sans",
        provider: fontProviders.google(),
        cssVariable: "--font-plus-jakarta-sans",
        fallbacks: ["sans-serif"],
      },
      {
        name: "JetBrains Mono",
        provider: fontProviders.google(),
        cssVariable: "--font-jetbrains-mono",
        fallbacks: ["monospace"],
      },
    ],
  },
});
