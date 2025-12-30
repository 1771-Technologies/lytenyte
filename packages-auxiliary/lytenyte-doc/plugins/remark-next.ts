import type { Root } from "mdast";
import type { LeafDirective } from "mdast-util-directive";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkNext: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "leafDirective", (node, index, parent) => {
      if (!parent || typeof index !== "number") return;

      const name = node.name;
      if (name !== "next") return;

      const nodes: LeafDirective[] = [];
      const position = index;

      let count = 0;
      while (
        index < parent.children.length &&
        parent.children[index].type === "leafDirective" &&
        (parent.children[index] as LeafDirective).name === "next"
      ) {
        nodes.push(parent.children[index] as LeafDirective);
        index++;
        count++;
      }
      parent.children.splice(position, count);

      const items: string[] = nodes.map((x) => {
        const child = x.children[0];
        if (child?.type !== "text") throw new Error("Next directive must have a text child");

        return child.value;
      });

      const mdxNode: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "Next",
        children: [],
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "items",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: JSON.stringify(items),
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "ArrayExpression",
                        elements: items.map((item) => ({
                          type: "Literal",
                          value: item,
                        })),
                      },
                    },
                  ],
                },
              },
            },
          } satisfies MdxJsxAttribute,
        ],
      };

      parent.children.splice(position, 0, mdxNode);
    });
  };
};
