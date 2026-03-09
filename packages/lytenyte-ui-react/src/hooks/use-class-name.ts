import { useMemo } from "react";
import type { ClassNameWithState } from "../type.js";

export function useClassName<T>(cls: ClassNameWithState<T> | undefined, state: T) {
  return useMemo(() => (typeof cls === "function" ? cls(state) : cls), [cls, state]);
}
