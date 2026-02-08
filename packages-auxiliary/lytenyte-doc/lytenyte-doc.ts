import { writeFile } from "fs/promises";
import { execSync } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import type { AstroIntegration } from "astro";
import mdx from "@astrojs/mdx";
import { mdxRoutes } from "./ln-doc/mdx-routes.js";
import { llmFull } from "./ln-doc/llms-full.js";
import { llmsText } from "./ln-doc/llms.js";
import { searchIndexFile } from "./ln-doc/search-index.js";
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
import { relative } from "node:path";
import { remarkBetterExpressiveCode } from "./plugins/remark-better-expressive-code.js";
import { remarkNext } from "./plugins/remark-next.js";

export { generateId } from "./collections/generate-id.js";
export { indexMdxH2H3 } from "./ln-doc/doc-index.js";
export interface OneDocConfig {
  readonly collections: (string | { name: string; base: string })[];
  readonly githubOrg: string;
  readonly githubRepo: string;

  readonly titleSuffix: string;
  readonly homeUrl: string;

  readonly llmWebsiteName: string;
  readonly llmWebsiteURL: string;
  readonly llmWebsiteDescription: string;

  readonly githubUrl: string;
  readonly links: {
    description: string;
    external: false;
    url: string;
    type: "icon" | "link";
    icon: "1771";
  }[];

  readonly navbar: {
    left?: {
      title: string;
      url: string;
      external?: boolean;
      matchSelected: { match: string[]; ignore: string[] };
      description: string;
      icon: "guides" | "api-reference" | "changelog" | "blog";
    }[];
    right?: {
      title: string;
      url: string;
      external?: boolean;
      matchSelected: { match: string[]; ignore: string[] };
      description: string;
      icon: "guides" | "api-reference" | "changelog" | "blog";
    }[];
  };
}

export function lnDoc(opts: OneDocConfig): AstroIntegration[] {
  const collections = opts.collections;

  return [
    {
      name: "one-doc",
      hooks: {
        "astro:config:setup": async ({ config, updateConfig, injectRoute, createCodegenDir }) => {
          const projectRoot = gitRoot();
          const root = relative(projectRoot, config.root.pathname);
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
                    if (id === "ln:all") return "ln:all";
                  },
                  load: (id) => {
                    if (id === "ln:all") {
                      return `
                        import { getCollection } from "astro:content";

                        const allCollections = await Promise.all([
                          ${collections
                            .map((col) => {
                              return `getCollection("${typeof col === "string" ? col : col.name}")`;
                            })
                            .join(",")}
                        ])

                        export const all = allCollections.flat();
                      `;
                    }

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
                            pro: z.boolean().optional(),
                            step: z.string().optional(),
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

          const mdxUrl = await mdxRoutes(codegen, collections);
          injectRoute({ pattern: `/[...id].mdx`, entrypoint: mdxUrl });
          const llmFullURL = await llmFull(codegen, collections);
          injectRoute({ pattern: `/llms-full.txt`, entrypoint: llmFullURL });
          const llms = await llmsText(
            codegen,
            collections,
            opts.llmWebsiteName,
            opts.llmWebsiteDescription,
            opts.llmWebsiteURL,
          );
          injectRoute({ pattern: `/llms.txt`, entrypoint: llms });

          const searchIndex = await searchIndexFile(codegen, collections);
          injectRoute({ pattern: "/search.json", entrypoint: searchIndex });

          for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            const name = typeof collection === "string" ? collection : collection.name;

            const url = new URL(`${collection}.astro`, codegen);

            const pageTemplate = `
---
import { getCollection } from "astro:content";
import { render } from "astro:content";
import "../../../src/main.css"

import Page from "@1771technologies/lytenyte-doc/page.astro";

export async function getStaticPaths() {
  const entries = await getCollection("${name}");
  return entries.map((entry) => {
    return { params: { slug: entry.id }, props: { entry } };
  });
}

const options = ${JSON.stringify(opts)};
const rootDir = "${root}";
const branch = "${getCurrentGitBranch()}";

const { entry } = Astro.props;
---

<Page entry={entry} options={options} rootDir={rootDir} branch={branch} />
`.trim();

            await writeFile(url, pageTemplate);

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
        remarkNext,
        remarkBetterExpressiveCode,
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

const gitRoot = () =>
  execSync("git rev-parse --show-toplevel", {
    encoding: "utf8",
  }).trim();

export function getCurrentGitBranch(cwd = process.cwd()) {
  try {
    // Works in normal repos. In detached HEAD it returns "HEAD".
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    return branch; // e.g. "main", "feature/foo", or "HEAD" (detached)
  } catch {
    return null; // not a git repo, git not installed, etc.
  }
}
