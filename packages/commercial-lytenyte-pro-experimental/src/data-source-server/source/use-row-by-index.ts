import type { RowAtom, RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import type { ServerData } from "../server-data";
import { useRef } from "react";
import {
  createSignal,
  useEvent,
  useSelector,
  type Signal,
} from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowByIndex<T>(source: ServerData, globalSignal: Signal<number>) {
  const invalidateCacheRef = useRef(new Map<number, (t: number) => void>());
  const atomCacheRef = useRef<Record<number, RowAtom<RowNode<T> | null>>>({});

  const rowInvalidate: RowSource<T>["rowInvalidate"] = useEvent((row) => {
    if (row == null) {
      globalSignal(Date.now());
    } else {
      const invalidate = invalidateCacheRef.current.get(row);
      invalidate?.(Date.now());
    }
  });

  const rowByIndex: RowSource<T>["rowByIndex"] = useEvent((rowI) => {
    const atomCache = atomCacheRef.current;
    const invalidateCache = invalidateCacheRef.current;

    if (!atomCache[rowI]) {
      const signal = createSignal(Date.now());
      invalidateCache.set(rowI, signal);

      atomCache[rowI] = {
        get: () => source.flat.rowIndexToRow.get(rowI) ?? null,
        useValue: () => {
          // Invalidate is used to invalidate an individual row, and the global signal will invalidate all rows.
          const localSnapshot = useSelector(signal);
          const globalSnapshot = useSelector(globalSignal);

          const row = source.flat.rowIndexToRow.get(rowI);
          if (!row) return null;

          Object.assign(row, {
            __localSnapshot: localSnapshot,
            __globalSnapshot: globalSnapshot,
          });

          return row;
        },
      };
    }
    return atomCache[rowI];
  });

  return { rowInvalidate, rowByIndex };
}
