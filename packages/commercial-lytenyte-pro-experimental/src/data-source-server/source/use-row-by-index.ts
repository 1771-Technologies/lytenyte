import type { RowAtom, RowLeaf, RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import type { ServerData } from "../server-data.js";
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
  const loadingCache = useRef<Record<number, RowLeaf<T>>>({});

  const rowInvalidate: RowSource<T>["rowInvalidate"] = useEvent((row) => {
    if (row == null) {
      globalSignal(Date.now());
    } else {
      const invalidate = invalidateCacheRef.current.get(row);
      invalidate?.(Date.now());
    }
  });

  const rowByIndex: RowSource<T>["rowByIndex"] = useEvent((i) => {
    const atomCache = atomCacheRef.current;
    const invalidateCache = invalidateCacheRef.current;

    if (!atomCache[i]) {
      const signal = createSignal(Date.now());
      invalidateCache.set(i, signal);
      atomCache[i] = {
        get: () => source.flat.rowIndexToRow.get(i) ?? null,
        useValue: () => {
          // Invalidate is used to invalidate an individual row, and the global signal will invalidate all rows.
          const localSnapshot = useSelector(signal);
          const globalSnapshot = useSelector(globalSignal);
          const flat = source.flat;

          const row = flat.rowIndexToRow.get(i);
          const isLoading = flat.loading.has(i);
          const isGroupLoading = flat.loadingGroup.has(i);
          const errorGroup = flat.erroredGroup.get(i);
          const error = flat.errored.get(i);

          if (!row) {
            if (!loadingCache.current[i]) {
              loadingCache.current[i] = {
                id: `__loading__placeholder__${i}`,
                data: null as any,
                kind: "leaf",
                loading: true,
                error: error,
              };
            }
            const loadingRow = loadingCache.current[i]!;
            Object.assign(loadingRow, { loading: true, error });
            return loadingRow;
          }

          if (row.kind === "leaf" || row.kind === "aggregated") {
            Object.assign(row, {
              loading: isLoading,
              error: error?.error,
              __localSnapshot: localSnapshot,
              __globalSnapshot: globalSnapshot,
            });
          } else if (row.kind === "branch") {
            Object.assign(row, {
              loading: isLoading,
              error: error?.error,
              errorGroup: errorGroup?.error,
              loadingGroup: isGroupLoading,
              __localSnapshot: localSnapshot,
              __globalSnapshot: globalSnapshot,
            });
          }

          return row;
        },
      };
    }
    return atomCache[i];
  });

  return { rowInvalidate, rowByIndex };
}
