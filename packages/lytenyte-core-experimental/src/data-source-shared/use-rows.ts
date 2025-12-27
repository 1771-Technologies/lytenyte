import type { RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import { usePiece } from "../internal.js";

export function useRows<T>(flatten: RowNode<T>[]) {
  const rows = useMemo<ReturnType<RowSource<T>["useRows"]>>(() => {
    return {
      get: (i: number) => flatten[i],
      size: flatten.length,
    };
  }, [flatten]);

  const rows$ = usePiece(rows);

  return rows$;
}
