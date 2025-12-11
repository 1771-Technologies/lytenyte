import { generateId } from "@1771technologies/lytenyte-doc";
import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./blog",
    generateId,
  }),
  schema: z.object({
    title: z.string(),
  }),
});

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./docs",
    generateId,
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, docs };
