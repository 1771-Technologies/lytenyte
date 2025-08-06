import { getFrameElement } from "./get-frame-element.js";
import { getNearestOverflowAncestor } from "./get-nearest-overflow-ancestor.js";
import { getWindow } from "./get-window.js";
import { isOverflowElement } from "./is-overflow-element.js";

type OverflowAncestors = Array<Element | Window | VisualViewport>;

export function getOverflowAncestors(
  /* v8 ignore next 60 */
  node: Node,
  list: OverflowAncestors = [],
  traverseIframes = true,
): OverflowAncestors {
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === node.ownerDocument?.body;
  const win = getWindow(scrollableAncestor);

  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
      frameElement && traverseIframes ? getOverflowAncestors(frameElement) : [],
    );
  }

  return list.concat(
    scrollableAncestor,
    getOverflowAncestors(scrollableAncestor, [], traverseIframes),
  );
}
