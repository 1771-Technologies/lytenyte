import type { XmlElement } from "./types.js";

/**
 * Returns the first direct child of the given element whose tag name matches,
 * or `undefined` if no such child exists.
 *
 * This is the single-result counterpart of `findChildElements`, useful for
 * child elements that appear at most once under a parent. In OOXML, many
 * container elements have a known set of optional singleton children -- for
 * example, `<v>` (value) or `<f>` (formula) inside a `<c>` (cell) element,
 * or `<t>` (text) inside a rich-text `<r>` run.
 */
export function findChildElement(parent: XmlElement, tag: string): XmlElement | undefined {
  return parent.children.find((c) => c.tag === tag);
}
