import { isHTMLElement } from "./is-html-element.js";
import { isShadowRoot } from "./is-shadow-root.js";

type ElementTarget = HTMLElement | EventTarget | null | undefined;

export function contains(parent: ElementTarget, child: ElementTarget) {
  if (!isHTMLElement(parent) || !isHTMLElement(child)) return false;

  if (parent === child) return true;
  if (parent.contains(child)) return true;

  const rootNode = child.getRootNode();
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) return true;
      // @ts-expect-error this is fine, but TypeScript will complain. Not worth it to type it properly
      next = next.parentNode || next.host;
    }
  }
  return false;
}
