import type { FocusTrapOptions } from "./+types.js";

export interface TrapOptions
  extends Pick<
    FocusTrapOptions,
    | "onActivate"
    | "onDeactivate"
    | "initialFocus"
    | "fallbackFocus"
    | "returnFocusOnDeactivate"
    | "setReturnFocus"
  > {
  /**
   * Whether the focus trap is disabled.
   */
  disabled?: boolean | undefined;
}
import { useEffect, useLayoutEffect } from "react";
import { trapFocus } from "./trap-focus.js";

export const useSafeLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
export const useFocusTrap = (element: HTMLElement | null, opts?: TrapOptions) => {
  useSafeLayoutEffect(() => {
    if (!element || opts?.disabled) return;

    return trapFocus(element, opts);
  }, [element, ...Object.values(opts ?? {})]);
};
