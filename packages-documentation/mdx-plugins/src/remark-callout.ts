import type { Plugin } from "unified";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { ContainerDirective } from "mdast-util-directive";
import type { MdxJsxFlowElement, MdxJsxAttribute } from "mdast-util-mdx-jsx";

declare module "mdast" {
  interface RootContentMap {
    containerDirective: ContainerDirective;
    mdxJsxFlowElement: MdxJsxFlowElement;
  }
}

const CALLOUT_TYPES = ["note", "tip", "info", "warn", "danger", "best"] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

export interface RemarkCalloutOptions {
  readonly calloutTypes?: string[];
  readonly componentName?: string;
}

export const remarkCallout: Plugin<[], Root> = (opts?: RemarkCalloutOptions) => {
  const calloutTypes = opts?.calloutTypes ?? CALLOUT_TYPES;
  const componentName = opts?.componentName ?? "Callout";

  return (tree) => {
    visit(tree, "containerDirective", (node: ContainerDirective, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const type = node.name as CalloutType;
      if (!calloutTypes.includes(type)) return;

      const attrs: MdxJsxAttribute[] = [];

      if (node.attributes) {
        for (const [key, value] of Object.entries(node.attributes)) {
          const v = value as any;
          attrs.push({
            type: "mdxJsxAttribute",
            name: key,
            value: v === null || v === true || v === false ? v : String(v),
          });
        }
      }

      attrs.push({ type: "mdxJsxAttribute", name: "type", value: type });

      const mdxNode: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: componentName,
        attributes: attrs,
        children: node.children,
        position: node.position, // keep original position for sourcemaps
      };

      parent.children.splice(index, 1, mdxNode);
    });
  };
};
