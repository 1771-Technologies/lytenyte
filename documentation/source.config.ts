import codeImport from "remark-code-import";
import codeDemo from "@1771technologies/remark-code-demo";
import type { CodeHikeConfig } from "codehike/mdx";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
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
