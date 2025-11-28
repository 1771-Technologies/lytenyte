// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    expressiveCode({
      themes: ["catppuccin-mocha", "catppuccin-latte"],
      themeCssSelector: (t) => {
        if (t.name === "catppuccin-mocha") return `[data-theme="dark"]`;

        return `[data-theme="light"]`;
      },
    }),
    mdx(),
  ],
});
