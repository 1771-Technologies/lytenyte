import { getDocumentElement } from "./get-document-element.js";
import { getParentNode } from "./get-parent-node.js";
import { isHTMLElement } from "../predicates/index.js";

/**
 * Returns the nearest element matching the predicate, starting at the given element and walking
 * up the DOM tree.
 */
export function getNearestMatching(
  start: HTMLElement,
  matchPredicate: (el: HTMLElement) => boolean,
): HTMLElement | null {
  if (matchPredicate(start)) return start;

  let current: Node | null = getParentNode(start);
  while (current && isHTMLElement(current) && current !== getDocumentElement(current)) {
    if (matchPredicate(current)) return current;
    current = current.parentElement;
  }

  return null;
}
