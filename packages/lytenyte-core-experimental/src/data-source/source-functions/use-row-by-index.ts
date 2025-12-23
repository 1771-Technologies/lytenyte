import { useRef } from "react";
import { useEvent } from "../../hooks/use-event.js";
import type { RowAtom, RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { createSignal, useSelector, type Signal } from "../../signal/signal.js";
import { usePiece, type Piece } from "../../hooks/use-piece.js";
import type { RootNode } from "../hooks/use-group-tree";

export function useRowByIndex<T>(
  tree: RootNode<T> | null,
  piece: Piece<RowNode<T>[]>,
  globalSignal: Signal<number>,
  selected: Set<string>,
  rowsIsolatedSelection: boolean,
) {
  const invalidateCacheRef = useRef(new Map<number, (t: number) => void>());
  const atomCacheRef = useRef<Record<number, RowAtom<RowNode<T> | null>>>({});

  const selectedPiece = usePiece(selected);

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

          const selected = selectedPiece.useValue((x) => {
            if (!row) return false;
            if (rowsIsolatedSelection) return x.has(row.id);
            if (row.kind === "leaf") return x.has(row.id);
            const group = tree?.groupLookup.get(row.id);
            if (!group) return false;

            return group.leafIds.isSubsetOf(x);
          });

          const isIndeterminate = selectedPiece.useValue((x) => {
            if (!row || row.kind === "leaf") return false;
            const group = tree?.groupLookup.get(row.id);
            if (!group) return false;

            const intersection = group.leafIds.intersection(x);

            return intersection.size > 0 && intersection.size !== group.leafIds.size;
          });

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
