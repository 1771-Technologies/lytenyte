import { defineConfig } from "waku/config";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  unstable_viteConfigs: {
    common: () => ({
      plugins: [contentCollections(), tailwindcss()],
    }),
  },
});
