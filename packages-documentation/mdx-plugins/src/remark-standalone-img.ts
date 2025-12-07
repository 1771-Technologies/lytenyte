// remark-standalone-image.ts
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Paragraph, Image, Text, Parent, RootContent, Root } from "mdast";

// MDX node types come from remark-mdx, but we can type them minimally.
type MdxJsxAttribute =
  | { type: "mdxJsxAttribute"; name: string; value: string | null }
  | {
      type: "mdxJsxAttribute";
      name: string;
      value: { type: "mdxJsxAttributeValueExpression"; value: string };
    };

type MdxJsxFlowElement = {
  type: "mdxJsxFlowElement";
  name: string;
  attributes: MdxJsxAttribute[];
  children: any[];
};

export type StandaloneImageOptions = {
  /**
   * If true, also treat paragraphs like: "  ![alt](url)  " as standalone.
   * (i.e. only image + whitespace text nodes)
   */
  allowSurroundingWhitespace?: boolean;

  /**
   * Component name to emit (default: StandaloneImage)
   */
  componentName?: string;
};

function isWhitespaceText(node: RootContent): node is Text {
  return node.type === "text" && /^\s*$/.test(node.value);
}

export const remarkStandaloneImage: Plugin<[], Root> = (options: StandaloneImageOptions = {}) => {
  const { allowSurroundingWhitespace = true, componentName = "StandaloneImage" } = options;

  return (tree: Parent) => {
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (index == null || !parent) return;

      const children = node.children ?? [];
      if (children.length === 0) return;

      // Determine whether this paragraph contains only a single image,
      // optionally allowing whitespace text nodes around it.
      const filtered = allowSurroundingWhitespace
        ? children.filter((c) => !isWhitespaceText(c))
        : children;

      if (filtered.length !== 1) return;
      const only = filtered[0];
      if (only.type !== "image") return;

      const img = only as Image;

      const replacement: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: componentName,
        attributes: [
          { type: "mdxJsxAttribute", name: "src", value: img.url },
          { type: "mdxJsxAttribute", name: "alt", value: img.alt ?? "" },
          ...(img.title
            ? ([{ type: "mdxJsxAttribute", name: "title", value: img.title }] as const)
            : []),
        ],
        children: [],
      };

      // Replace the whole paragraph with the JSX flow element
      (parent.children as any[]).splice(index, 1, replacement);
    });
  };
};

export default remarkStandaloneImage;
