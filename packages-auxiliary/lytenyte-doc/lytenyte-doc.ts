import { writeFile } from "fs/promises";
import tailwindcss from "@tailwindcss/vite";
import type { AstroIntegration } from "astro";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import {
  remarkStandaloneImage,
  remarkDirective,
  remarkCallout,
  remarkDemo,
  remarkLastModified,
  remarkMath,
  rehypeKatex,
} from "./plugins/index.js";

export interface OneDocConfig {
  readonly collections: (string | { name: string; base: string })[];
  readonly githubOrg?: string;
  readonly githubRepo?: string;
}

export function lnDoc(opts: OneDocConfig): AstroIntegration[] {
  const collections = opts.collections;

  return [
    {
      name: "one-doc",
      hooks: {
        "astro:config:setup": async ({ config, updateConfig, injectRoute, createCodegenDir }) => {
          updateConfig({
            markdown: {
              rehypePlugins: [rehypeKatex],
            },
            vite: {
              plugins: [
                tailwindcss() as any,
                {
                  resolveId: (id) => {
                    if (id === "ln:collections") return "ln:collections";
                  },
                  load: (id) => {
                    if (id === "ln:collections") {
                      const file = `
                      import { defineCollection, z } from "astro:content";
                      import { generateId } from "@1771technologies/lytenyte-doc";
                      import { glob } from "astro/loaders"

                      ${collections
                        .map((x) => {
                          const name = typeof x === "string" ? x : x.name;
                          return `const ${name} = defineCollection({
                          loader: glob({
                            pattern: "**/*.mdx",
                            base: "./${x}",
                            generateId
                          }),
                          schema: z.object({
                            title: z.string(),
                            description: z.string().optional(),
                          })
                        })`;
                        })
                        .join("\n")}


                      export const collections = { ${collections.map((x) => `${typeof x === "string" ? x : x.name}`).join(", ")} }
                      `;

                      return file;
                    }
                  },
                },
              ],

              resolve: {
                alias: {
                  "@1771technologies/lytenyte-doc/collections": "ln:collections",
                  "@root": config.root.pathname,
                },
              },
            },
          });

          const codegen = createCodegenDir();
          for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            const name = typeof collection === "string" ? collection : collection.name;

            const url = new URL(`${collection}.astro`, codegen);

            await writeFile(url, pageTemplate.replace("##replace", `${name}`));

            injectRoute({
              pattern: `/${collection}/[...slug]`,
              entrypoint: url,
            });
          }
        },
      },
    },
    expressiveCode(),
    mdx({
      remarkPlugins: [
        remarkStandaloneImage,
        [remarkDemo, { ...opts }],
        remarkDirective,
        remarkCallout,
        remarkLastModified,
        remarkMath,
      ],
    }),
  ];
}

const pageTemplate = `
---
import "@1771technologies/lytenyte-doc/theme.css";
import { getCollection } from "astro:content";
import { render } from "astro:content";

import Page from "@1771technologies/lytenyte-doc/page.astro";

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

export { generateId } from "./collections/generate-id.js";
