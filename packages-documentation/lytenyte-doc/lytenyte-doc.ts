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
} from "@1771technologies/mdx-plugins";

export type Link = string | { href: string; label: string } | { path: string; label: string };
export type Subsection = {
  readonly name: string;
  readonly path: string;
  readonly expanded?: boolean;
  readonly expandable?: boolean;
  readonly links: Link[];
};

interface Sidebar {
  readonly path: string;
  readonly collection: string;
  readonly sections: {
    readonly name: string;
    readonly children: (Link | Subsection)[];
  }[];
}

export interface OneDocConfig {
  readonly sidebar: Sidebar[];
  readonly collections?: string[];

  readonly githubOrg?: string;
  readonly githubRepo?: string;
}

export function lnDoc(opts?: OneDocConfig): AstroIntegration[] {
  const collections = opts?.collections ?? ["blog"];

  return [
    {
      name: "one-doc",
      hooks: {
        "astro:config:setup": async ({ config, updateConfig, injectRoute, createCodegenDir }) => {
          updateConfig({
            vite: {
              plugins: [
                tailwindcss() as any,
                {
                  resolveId: (id) => {
                    if (id === "one:doc") return "one:doc";
                  },
                  load: (id) => {
                    if (id === "one:doc")
                      return `export default ${JSON.stringify(opts?.sidebar ?? [])}`;
                  },
                },
              ],
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
    expressiveCode(),
    mdx({
      remarkPlugins: [
        remarkStandaloneImage,
        [remarkDemo, { ...opts }],
        remarkDirective,
        remarkCallout,
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
