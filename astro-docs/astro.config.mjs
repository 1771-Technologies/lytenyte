import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { lnDoc } from "@1771technologies/lytenyte-doc";

export default defineConfig({
  integrations: [
    react(),
    lnDoc({
      githubOrg: "1771-technologies",
      githubRepo: "lytenyte",
      collections: ["blog", "docs"],
    }),
  ],
});
