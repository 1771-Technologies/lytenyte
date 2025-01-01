import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pages from "vite-plugin-pages";
import wyw from "@wyw-in-js/vite";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: {
        "@linaria/core": ["css"],
      },
      dts: false,
    }),
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    pages({
      dirs: [
        {
          dir: "play",
          baseRoute: "",
          filePattern: "**/*.play.tsx",
        },
      ],
      extendRoute: (route) => {
        const path = route.path;

        return {
          ...route,
          path: path.replace(".play", "play").replace("index", ""),
        };
      },
    }),
    react(),
  ],
  resolve: {
    alias: {
      "/play-entry.tsx": "@1771technologies/aio/play-entry.tsx",
    },
  },
});
