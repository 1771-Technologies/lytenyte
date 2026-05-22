import type { XmlElement } from "./types.js";

/**
 * Returns all direct children of the given element whose tag name matches,
 * without descending into deeper levels of the tree.
 *
 * This is used when the OOXML schema nests repeating elements under a known
 * parent and only the immediate children are meaningful. For instance,
 * extracting `<r>` (rich-text run) elements that are direct children of an
 * `<si>` (shared-string item), or collecting `<xf>` format records directly
 * under `<cellXfs>`. Unlike `findElements`, this function never recurses,
 * so it avoids matching deeper descendants that happen to share the same
 * tag name.
 */
export function findChildElements(parent: XmlElement, tag: string): XmlElement[] {
  return parent.children.filter((c) => c.tag === tag);
}
