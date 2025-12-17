import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import { toString as mdastToString } from "mdast-util-to-string";

export interface DocIndex {
  header: string;
  id: string;
  tokens: number;
  depth: number;
  text: string; // rendered plain text, single-line, code blocks removed
}

type Root = { type: "root"; children: any[] };

export function indexMdxH2H3(mdx: string): DocIndex[] {
  const slugger = new GithubSlugger();
  slugger.reset();

  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(mdx) as Root;
  const children = Array.isArray(tree.children) ? tree.children : [];

  const results: DocIndex[] = [];

  let i = 0;
  while (i < children.length) {
    const node = children[i];

    if (isHeading(node, 2) || isHeading(node, 3) || isHeading(node, 1)) {
      const header = normalizeText(stripMarkdownAttributes(mdastToString(node)));
      const id = slugger.slug(header);

      const depth = node.depth;
      // Collect nodes until next H2/H3 (or end)
      const sectionNodes: any[] = [node];
      let j = i + 1;
      while (j < children.length) {
        const n = children[j];
        if (isHeading(n, 2) || isHeading(n, 3) || isHeading(n, 1)) break;
        if (n.type === "code" || n.type === "mdxJsxFlowElement") {
          j++;
          continue;
        }
        sectionNodes.push(n);
        j++;
      }

      const sectionText = normalizeText(
        stripMarkdownAttributes(nodesToRenderedTextNoCodeBlocks(sectionNodes)),
      );

      const bodyText = normalizeText(
        stripMarkdownAttributes(nodesToRenderedTextNoCodeBlocks(sectionNodes.slice(1))),
      );

      results.push({
        header,
        id,
        text: sectionText,
        depth,
        tokens: countTokensApprox(bodyText),
      });

      i = j;
      continue;
    }

    i++;
  }

  return results.filter((x) => x.tokens > 10);
}

function isHeading(node: any, depth: 1 | 2 | 3): boolean {
  return node?.type === "heading" && node?.depth === depth;
}

/**
 * Render plain text from a list of mdast nodes, skipping *block* code nodes (type: "code")
 * so fenced/indented code blocks are removed entirely.
 */
function nodesToRenderedTextNoCodeBlocks(nodes: any[]): string {
  const parts: string[] = [];

  for (const n of nodes) {
    if (!n) continue;
    if (n.type === "code") continue; // remove code blocks

    // For non-code nodes, mdast-util-to-string is a good plain-text rendering.
    // Some nodes (like lists/paragraphs) will flatten naturally.
    const t = mdastToString(n);
    if (t) parts.push(t);
  }

  return parts.join(" ");
}

/**
 * Removes common markdown attribute blocks like: "Title {#id .class key=val}"
 */
function stripMarkdownAttributes(s: string): string {
  return s.replace(/\s*\{[^}]*\}\s*$/gm, "");
}

/**
 * Replace newlines with spaces + collapse whitespace.
 */
function normalizeText(s: string): string {
  return (s || "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countTokensApprox(text: string): number {
  if (!text) return 0;
  const chunks = text.match(/\S+/g);
  return chunks ? chunks.length : 0;
}
