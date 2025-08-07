// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

// mdx-plugins/add-lead.ts
import { visit } from "unist-util-visit";
var rehypeAddLeadToH2 = () => {
  return (tree) => {
    let found = false;
    visit(tree, "element", (node) => {
      if (!found && node.tagName === "h2") {
        if (!node.properties) {
          node.properties = {};
        }
        const className = node.properties.className;
        if (Array.isArray(className)) {
          node.properties.className = [...className, "lead"];
        } else if (typeof className === "string") {
          node.properties.className = [className, "lead"];
        } else {
          node.properties.className = ["lead"];
        }
        found = true;
      }
    });
  };
};

// source.config.ts
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";
var guides = defineDocs({
  dir: "src/guides",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string())
    })
  },
  meta: {}
});
var changelog = defineDocs({
  dir: "src/changelog",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string())
    })
  },
  meta: {}
});
var reference = defineDocs({
  dir: "src/reference",
  docs: {
    schema: z.object({
      title: z.string(),
      description: z.string(),
      priority: z.number(),
      navKey: z.optional(z.string()),
      navTitle: z.optional(z.string())
    })
  },
  meta: {}
});
var chConfig = {
  components: {
    code: "Code"
  }
};
var source_config_default = defineConfig({
  mdxOptions: {
    rehypePlugins: [rehypeAddLeadToH2],
    remarkPlugins: (v) => [[remarkCodeHike, chConfig], ...v],
    recmaPlugins: [[recmaCodeHike, chConfig]]
  }
});
export {
  changelog,
  source_config_default as default,
  guides,
  reference
};
