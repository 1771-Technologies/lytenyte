import type { XmlElement } from "./types.js";

/**
 * Performs a recursive depth-first search of the entire XML tree and returns
 * every element whose local tag name matches the given string.
 *
 * Use this helper to collect all instances of a
 * repeating element regardless of where they appear in the hierarchy. Typical
 * OOXML uses include gathering all `<row>` elements from a worksheet, all
 * `<c>` (cell) elements, or all `<si>` entries from the shared-strings table.
 * The results are returned in document order.
 */
export function findElements(root: XmlElement, tag: string): XmlElement[] {
  const results: XmlElement[] = [];

  collectElements(root, tag, results);

  return results;
}

function collectElements(el: XmlElement, tag: string, results: XmlElement[]): void {
  if (el.tag === tag) results.push(el);

  for (const child of el.children) {
    collectElements(child, tag, results);
  }
}
