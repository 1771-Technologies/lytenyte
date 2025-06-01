import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import { getSlugPath } from "./src/lib/routing/get-slug-path";

const collections = [
  { name: "lytenyteGuides", path: "lytenyte/guides" },
  { name: "lytenyteApiRef", path: "lytenyte/reference" },
  { name: "lytenyteChangelog", path: "lytenyte/changelog" },
];

const docs = collections.map((c) =>
  defineCollection({
    name: c.name,
    directory: `collections/${c.path}`,
    include: "**/*.mdx",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string()),
    }),
    transform: async (document, context) => {
      const path = document._meta.filePath.split("/");
      path.pop()!;

      if (!path.length) {
        console.error(
          "Every content collection item should be nested within a folder. Use (00n) for folders that should not impact routing",
        );
        process.exit(1);
      }

      const sections = path.map((p) => {
        const cleaned = p.replace("(", "").split(").")[0].replace(")", "");

        const [priorityRaw, ...nameParts] = cleaned.split("-");
        const name = nameParts.join("-");
        const priority = Number.parseInt(priorityRaw);
        if (Number.isNaN(priority))
          return { priority: 999, name, expanded: priorityRaw.includes("+") };
        return { priority, name, expanded: priorityRaw.includes("+") };
      });

      const mdx = await compileMDX(context, document);
      return {
        ...document,
        sections,
        slug: getSlugPath(document._meta.filePath),
        filePath: document._meta.filePath,
        mdx,
      };
    },
  }),
);

export default defineConfig({
  collections: docs,
});
