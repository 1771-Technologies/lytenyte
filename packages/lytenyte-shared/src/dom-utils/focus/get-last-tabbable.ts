import type { IncludeContainerType } from "./+types.js";
import { getTabbables } from "./get-tabbables.js";

export function getLastTabbable(
  container: HTMLElement | null,
  includeContainer?: IncludeContainerType,
): HTMLElement | null {
  const elements = getTabbables(container, includeContainer);
  return elements[elements.length - 1] || null;
}
