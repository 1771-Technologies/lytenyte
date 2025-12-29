import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

export const remarkBetterExpressiveCode: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const lang = node.lang ?? "txt";

      const replacement: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "BlockCode",
        children: [],
        position: node.position,
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "lang",
            value: lang,
          },
          {
            type: "mdxJsxAttribute",
            name: "code",
            value: node.value,
          },
        ],
      };

      // Replace the original code node with our MDX JSX node
      (parent.children as any[]).splice(index, 1, replacement);
    });
  };
};
