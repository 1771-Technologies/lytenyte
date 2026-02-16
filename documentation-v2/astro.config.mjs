import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { lnDoc } from "@1771technologies/lytenyte-doc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    lnDoc({
      githubOrg: "1771-technologies",
      githubRepo: "lytenyte",
      collections: ["blog", "docs"],
      llmWebsiteDescription: "Documentation and blogs for LyteNyte Grid built by 1771 Technologies",
      llmWebsiteName: "1771 Technologies",
      llmWebsiteURL: "https://1771technologies",
      titleSuffix: "1771 Technologies",
      homeUrl: "/docs/intro-getting-started",

      githubUrl: "https://github.com/1771-Technologies/lytenyte",
      links: [
        {
          text: "1771 Technologies home page",
          external: false,
          url: "https://www.1771technologies.com/",
          type: "icon",
          icon: "1771",
        },
      ],
      navbar: {
        docVersions: [
          { title: "v2", full: "v2.0.0", href: "latest" },
          {
            title: "v1",
            full: "v1.0.20",
            href: "https://www.1771technologies.com/docs/intro-getting-started",
          },
        ],
        left: [
          {
            title: "Guides",
            url: "/docs/intro-getting-started",
            matchSelected: {
              match: ["/docs"],
              ignore: ["/docs/reference", "/docs/changelog"],
            },
            description:
              "Tutorials and quick walkthroughs of LyteNyte Grid. These docs are more user friendly and description than the API reference.",
            icon: "guides",
          },
          {
            title: "API Reference",
            url: "/docs/reference",
            matchSelected: {
              match: ["/docs/reference"],
              ignore: [],
            },
            description:
              "In depth references to all the different parts of the LyteNyte Grid components, apis, and interfaces.",
            icon: "api-reference",
          },
          {
            title: "Changelog",
            url: "/docs/changelog/latest",
            matchSelected: {
              match: ["/docs/changelog"],
              ignore: [],
            },
            description: "A log of all the changes introduced between LyteNyte Grid versions.",
            icon: "changelog",
          },
        ],
      },
    }),
  ],
});
