import type { IncludeContainerType } from "./+types.js";
import { getFocusables } from "./get-focusables.js";

export function getFirstFocusable(
  container: HTMLElement | null,
  includeContainer?: IncludeContainerType,
): HTMLElement | null {
  const [first] = getFocusables(container, includeContainer);
  return first || null;
}
