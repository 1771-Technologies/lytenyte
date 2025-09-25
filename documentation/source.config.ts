import z from "zod";
import codeImport from "remark-code-import";
import codeDemo from "@1771technologies/remark-code-demo";
import type { CodeHikeConfig } from "codehike/mdx";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

import { defineConfig, defineDocs, metaSchema } from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: z.object({
      pro: z.optional(z.boolean()),
      title: z.string(),
      description: z.optional(z.string()),
      icon: z.optional(z.string()),
      full: z.optional(z.boolean()),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

const chConfig: CodeHikeConfig = {
  components: {
    code: "Code",
    inlineCode: "InlineCode",
  },
  ignoreCode: (codeblock) => codeblock.lang === "package-install",
};

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => {
      return [
        [
          codeDemo,
          {
            githubOrg: "1771-Technologies",
            githubRepo: "lytenyte",
            githubBranch: "main",
          },
        ],
        codeImport,
        [remarkCodeHike, chConfig],
        ...v,
      ];
    },
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
});
