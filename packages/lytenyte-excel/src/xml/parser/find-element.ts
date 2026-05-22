import type { XmlElement } from "./types.js";

/**
 * Finds the first element with a matching tag name anywhere in the XML tree,
 * using a depth-first traversal. Returns `undefined` if no match exists.
 *
 * This is intended for singleton or unique elements in an OOXML part where
 * only one instance is expected. Common targets include `<sheetData>`,
 * `<autoFilter>`, `<pane>`, `<cellXfs>`, and `<sst>` (shared-string table).
 * Searching stops as soon as the first match is found, so it is more
 * efficient than `findElements` when only one result is needed.
 */
export function findElement(root: XmlElement, tag: string): XmlElement | undefined {
  if (root.tag === tag) return root;

  for (const child of root.children) {
    const found = findElement(child, tag);
    if (found) return found;
  }

  return undefined;
}
