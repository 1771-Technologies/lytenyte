import type { IncludeContainerType } from "./+types.js";
import { getTabbables } from "./get-tabbables.js";

export function getFirstTabbable(
  container: HTMLElement | null,
  includeContainer?: IncludeContainerType,
): HTMLElement | null {
  const [first] = getTabbables(container, includeContainer);
  return first || null;
}
