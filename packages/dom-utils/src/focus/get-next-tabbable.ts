import { getActiveElement } from "../get-active-element.js";
import { getTabbables } from "./get-tabbables.js";

export function getNextTabbable(
  container: HTMLElement | null,
  current?: HTMLElement | null,
): HTMLElement | null {
  const tabbables = getTabbables(container);
  const doc = container?.ownerDocument || document;
  const currentElement = current ?? getActiveElement(doc);

  if (!currentElement) return null;

  const index = tabbables.indexOf(currentElement);
  return tabbables[index + 1] || null;
}
