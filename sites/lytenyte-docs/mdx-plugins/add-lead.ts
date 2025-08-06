import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "hast";
import type { Element } from "hast";

export const rehypeAddLeadToH2: Plugin<[], Root> = () => {
  return (tree: Root) => {
    let found = false;

    visit(tree, "element", (node: Element) => {
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
