import { writeFile } from "fs/promises";
import tailwindcss from "@tailwindcss/vite";
import type { AstroIntegration } from "astro";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import { remarkDirective, remarkCallout, remarkDemo } from "@1771technologies/mdx-plugins";

export interface OneDocConfig {
  readonly collections?: string[];
}

export function astroDoc(opts?: OneDocConfig): AstroIntegration[] {
  const collections = opts?.collections ?? ["blog"];

  return [
    {
      name: "one-doc",
      hooks: {
        "astro:config:setup": async ({ config, updateConfig, injectRoute, createCodegenDir }) => {
          updateConfig({
            vite: {
              plugins: [tailwindcss() as any],
              resolve: {
                alias: {
                  "@root": config.root.pathname,
                },
              },
            },
          });
          const codegen = createCodegenDir();
          for (const collection of collections) {
            const url = new URL(`${collection}.astro`, codegen);

            await writeFile(url, pageTemplate.replace("##replace", collection));

            injectRoute({
              pattern: `/${collection}/[...slug]`,
              entrypoint: url,
            });
          }
        },
      },
    },

    expressiveCode({
      themes: ["vitesse-black", "vitesse-light"],
      themeCssSelector: (t) => {
        if (t.name === "vitesse-black") return `[data-theme="dark"]`;
        return `[data-theme="light"]`;
      },
    }),
    mdx({
      remarkPlugins: [remarkDemo, remarkDirective, remarkCallout],
    }),
  ];
}

const pageTemplate = `
---
import "@1771technologies/astro-doc/theme.css";
import { getCollection } from "astro:content";
import { render } from "astro:content";

import Page from "@1771technologies/astro-doc/page.astro";

export async function getStaticPaths() {
  const entries = await getCollection("##replace");
  return entries.map((entry) => {
    return { params: { slug: entry.id }, props: { entry } };
  });
}

const { entry } = Astro.props;
---

<Page entry={entry} />
`.trim();
