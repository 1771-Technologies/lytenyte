import { useRef } from "react";
import { useEvent } from "../hooks/use-event.js";
import type {
  RowAtom,
  RowNode,
  RowSelectionStateWithParent,
  RowSource,
} from "@1771technologies/lytenyte-shared";
import { createSignal, useSelector, type Signal } from "../signal/signal.js";
import { type Piece } from "../hooks/use-piece.js";
import { isRowSelected } from "./row-selection/is-row-selected.js";

export function useRowByIndex<T>(
  piece: Piece<RowNode<T>[]>,
  globalSignal: Signal<number>,
  state: { rowSelections: RowSelectionStateWithParent },
  rowParents: (id: string) => string[],
) {
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
      const $ = (x: RowNode<T>[]) => x[rowI] ?? null;

      const signal = createSignal(Date.now());
      invalidateCache.set(rowI, signal);

      atomCache[rowI] = {
        get: () => piece.get()[rowI],
        useValue: () => {
          // Invalidate is used to invalidate an individual row, and the global signal will invalidate all rows.
          const localSnapshot = useSelector(signal);
          const globalSnapshot = useSelector(globalSignal);

          const row = piece.useValue($);
          const selected = isRowSelected(row.id, state.rowSelections, rowParents);
          const isIndeterminate = false;

          Object.assign(row, {
            __selected: selected,
            __indeterminate: isIndeterminate,
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
