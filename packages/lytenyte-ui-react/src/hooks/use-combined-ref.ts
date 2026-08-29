import type { Ref } from "react";
import { useCallback } from "react";

export function useCombinedRefs<T>(...refs: (Ref<any> | null | undefined)[]): React.RefCallback<T> {
  const combinedRef = useCallback((element: T | null) => {
    for (let i = 0; i < refs.length; i++) {
      const r = refs[i];
      if (!r) continue;
      if (typeof r === "function") r(element);
      else r.current = element;
    }
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, refs);

  return combinedRef;
}
