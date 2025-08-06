import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";
import { rehypeAddLeadToH2 } from "./mdx-plugins/add-lead";
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from "codehike/mdx";

export const guides = defineDocs({
  dir: "src/guides",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string()),
    }),
  },
  meta: {},
});

export const changelog = defineDocs({
  dir: "src/changelog",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string()),
    }),
  },
  meta: {},
});

export const reference = defineDocs({
  dir: "src/reference",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string()),
    }),
  },
  meta: {},
});

const chConfig: CodeHikeConfig = {
  components: {
    code: "Code",
  },
};

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [rehypeAddLeadToH2],
    remarkPlugins: (v) => [[remarkCodeHike, chConfig], ...v],
    recmaPlugins: [[recmaCodeHike, chConfig]],
  },
});
