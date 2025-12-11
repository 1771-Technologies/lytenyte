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

      sidebar: [
        {
          path: "/docs",
          collection: "docs",
          sections: [
            {
              name: "Introduction",
              children: [
                "intro-getting-started",
                "intro-installation",
                "intro-installation-shadcn",
                "intro-license-activation",
                "intro-getting-support",
              ],
            },
            {
              name: "Production Ready",
              children: [
                "prodready-bundling",
                "prodready-security",
                "prodready-supported-browsers",
                "prodready-grid-versioning",
              ],
            },
            {
              name: "Grid",
              children: [
                "grid-container",
                "grid-reactivity",
                "grid-headless-parts",
                "grid-events",
                "grid-virtualization",
              ],
            },
          ],
        },
      ],
    }),
  ],
});
