import type { Grid } from "../../../index.js";

const FADE_ENTER: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];
const FADE_EXIT: Keyframe[] = [{ opacity: 1 }, { opacity: 0 }];

/**
 * Resolves an enter/exit `type` (a built-in name, or a user-supplied function) into the actual
 * keyframes to play on `element` - whichever element the grid is about to call `.animate()` on.
 * Shared by row and column animation execution since `Grid.AnimateEnterExitType` is the same type
 * for both.
 */
export function enterKeyframesFor(type: Grid.AnimateEnterExitType, element: HTMLElement): Keyframe[] {
  if (typeof type === "function") return type(element);
  return FADE_ENTER;
}

export function exitKeyframesFor(type: Grid.AnimateEnterExitType, element: HTMLElement): Keyframe[] {
  if (typeof type === "function") return type(element);
  return FADE_EXIT;
}
