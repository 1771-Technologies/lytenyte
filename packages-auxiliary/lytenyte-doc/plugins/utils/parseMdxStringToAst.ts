import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { mdxjsEsmFromMarkdown } from "mdast-util-mdxjs-esm";
import type { Root } from "mdast";
import { mdxjs } from "micromark-extension-mdxjs";

export function parseMdxStringToAst(source: string) {
  const tree = fromMarkdown(source, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxFromMarkdown(), mdxjsEsmFromMarkdown()],
  });

  return (tree as Root).children;
}
