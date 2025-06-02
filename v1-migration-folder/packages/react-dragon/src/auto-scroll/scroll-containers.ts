import {
  getDocumentElement,
  getOverflowAncestors,
  isElement,
} from "@1771technologies/lytenyte-dom-utils";
import type { DragPosition } from "../+types";

export function scrollContainers(coords: DragPosition, margin: number, speed: number) {
  const el = document.elementFromPoint(coords.x, coords.y);
  if (!el) return;

  const containers = getOverflowAncestors(el);

  containers.forEach((container) => {
    let rect: DOMRect;

    let scrollEl: Element;
    if (isElement(container)) {
      rect = container.getBoundingClientRect();
      scrollEl = container;
    } else {
      const documentElement = getDocumentElement(el);
      rect = documentElement.getBoundingClientRect();
      scrollEl = documentElement;
    }

    // Vertical scroll
    if (coords.y - rect.top < margin) {
      scrollEl.scrollTop -= speed;
    } else if (rect.bottom - coords.y < margin) {
      scrollEl.scrollTop += speed;
    }

    // Horizontal scroll
    if (coords.x - rect.left < margin) {
      scrollEl.scrollLeft -= speed;
    } else if (rect.right - coords.x < margin) {
      scrollEl.scrollLeft += speed;
    }
  });
}
