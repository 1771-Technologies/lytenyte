import { useMemo } from "react";
import type { StyleWithState } from "../type.js";

export function useStyle<T>(style: StyleWithState<T> | undefined, state: T) {
  return useMemo(() => (typeof style === "function" ? style(state) : style), [style, state]);
}
