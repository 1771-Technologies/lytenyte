import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./blog",
    generateId: ({ entry }) => {
      const cleaned = entry
        .split("/")
        .filter((segment) => !/^\([^/]*\)$/.test(segment))
        .join("/");
      return cleaned.replaceAll(".mdx", "");
    },
  }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog };
