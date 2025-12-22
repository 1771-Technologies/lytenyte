import { useCallback, useMemo, useRef } from "react";
import type {
  AggregationFn,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
  RowAtom,
  RowLeaf,
  RowNode,
  RowSource,
  SortFn,
} from "@1771technologies/lytenyte-shared";
import { usePiece } from "../hooks/use-piece.js";
import { useFlattenedPiece } from "./hooks/use-flattened-piece.js";
import { useLeafNodes } from "./hooks/use-leaf-nodes.js";
import { useFiltered } from "./hooks/use-filtered.js";
import { useSorted } from "./hooks/use-sorted.js";
import { useGroupTree } from "./hooks/use-group-tree.js";
import { useControlled } from "../hooks/use-controlled.js";
import { useFlattenedGroups } from "./hooks/use-flattened-groups.js";
import { useEvent } from "../hooks/use-event.js";
import { createSignal, useSelector, type Signal } from "../signal/signal.js";

export interface UseClientDataSourceParams<T> {
  readonly data: T[];
  readonly topData?: T[];
  readonly botData?: T[];

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly sort?: SortFn<T>;
  readonly filter?: FilterFn<T>;
  readonly group?: GroupFn<T>;
  readonly aggregate?: AggregationFn<T>;

  readonly leafIdFn?: LeafIdFn<T>;
  readonly groupIdFn?: GroupIdFn;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowsSelected?: Set<string>;

  readonly onRowSelectionChange?: (newSelection: Set<string>) => void;
  readonly onRowDataChange?: (params: {
    readonly rows: Map<RowNode<T>, T>;
    readonly top: Map<number, T>;
    readonly bottom: Map<number, T>;
    readonly center: Map<number, T>;
  }) => void;
}

const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function useClientDataSource<T>({
  data,
  topData,
  botData,
  filter,
  sort,
  group,
  aggregate,

  rowGroupDefaultExpansion = false,
  rowGroupExpansions,

  leafIdFn,
  groupIdFn = groupIdFallback,

  rowsIsolatedSelection = false,
  rowsSelected: selectedRows,

  onRowDataChange: handleRowsUpdate,
  onRowSelectionChange: handleSelectChange,
}: UseClientDataSourceParams<T>) {
  const [leafsTop, leafs, leafsBot, leafIdsRef] = useLeafNodes(topData, data, botData, leafIdFn);

  const filtered = useFiltered(leafs, filter);
  const sorted = useSorted(leafs, sort, filtered);

  const [expansions, setExpansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });

  const [selected, setSelectedUncontrolled] = useControlled<Set<string>>({
    controlled: selectedRows,
    default: new Set(),
  });

  const setSelected = useEvent((s: Set<string>) => {
    handleSelectChange?.(s);
    setSelectedUncontrolled(s);
  });

  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  const tree = useGroupTree(leafs, sorted, group, groupIdFn);
  const treeRef = useRef(tree);
  treeRef.current = tree;

  const [groupFlat, maxDepth] = useFlattenedGroups(tree, aggregate, leafs, sorted, sort, expandedFn);

  const {
    flatten: piece,
    rowByIdRef,
    rowByIndexRef,
    rowIdToRowIndexRef,
  } = useFlattenedPiece({
    leafsTop,
    leafsCenter: leafs,
    leafsBot,
    groupFlat,
    centerIndices: sorted,
  });

  const botPiece = usePiece(leafsBot.length);
  const topPiece = usePiece(leafsTop.length);
  const maxDepthPiece = usePiece(maxDepth);

  const rowGroupIsExpanded = useEvent((id: string) => {
    const row = rowByIdRef.current.get(id);
    if (!row || row.kind !== "branch") return false;

    const state = expansions[row.id];
    if (state != null) return state;

    if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

    return row.depth <= rowGroupDefaultExpansion;
  });

  const handleUpdateRef = useRef(handleRowsUpdate);
  handleUpdateRef.current = handleRowsUpdate;

  const globalSignal = useRef<Signal<number>>(null as any);
  if (!globalSignal.current) {
    globalSignal.current = createSignal(Date.now());
  }

  const rowParents: RowSource<T>["rowParents"] = useEvent((id) => {
    // Can't have parents if there are no groups.
    if (!tree) return [];

    const row = source.rowById(id);
    if (!row) return [];

    if (row.kind === "branch") {
      const group = tree?.groupLookup.get(row.id);
      if (!group) return [];

      const parents = [];
      let current = group.parent;
      while (current && current.kind !== "root") {
        parents.push(current.id);
        current = current.parent;
      }

      return parents;
    }

    const path = group!(row);
    if (!path?.length) return [];
    const groupId = groupIdFn(path);
    const groupNode = tree?.groupLookup.get(groupId);
    if (!groupNode) return [];

    const parents = [];
    let current = groupNode.parent;
    while (current && current.kind !== "root") {
      parents.push(current.id);
      current = current.parent;
    }

    return parents;
  });

  const rowIsSelected: RowSource<T>["rowIsSelected"] = useEvent((id) => {
    if (rowsIsolatedSelection) return selected.has(id);

    const row = source.rowById(id);
    if (!row) return false;
    if (row.kind === "leaf") return selected.has(id);

    const group = tree?.groupLookup.get(row.id);
    if (!group) return false;

    return group.leafIds.isSubsetOf(selected);
  });
  const onRowsSelected: RowSource<T>["onRowsSelected"] = useEvent(({ selected: c, deselect, mode }) => {
    if (mode === "none") return;
    if (mode === "single" && c === "all") return;

    if (mode === "single") {
      const first = (c as string[]).find((x) => source.rowById(x)?.kind === "leaf");
      if (!first) return;

      if (deselect) setSelected(new Set());
      else setSelected(new Set([first]));

      return;
    }

    if (deselect && c === "all") return setSelected(new Set());
    else if (c === "all")
      return setSelected(
        new Set([
          ...sorted.map((x) => leafs[x].id),
          ...leafsTop.map((x) => x.id),
          ...leafsBot.map((x) => x.id),
        ]),
      );

    if (rowsIsolatedSelection) {
      const next = deselect ? selected.difference(new Set(c)) : selected.union(new Set(c));
      setSelected(next);
      return;
    }

    const finalSelected = !tree?.groupLookup
      ? new Set(c)
      : new Set(
          c.flatMap((id) => {
            const group = tree.groupLookup.get(id);
            if (group) return [...group.leafIds];
            return id;
          }),
        );

    const next = deselect ? selected.difference(finalSelected) : selected.union(finalSelected);
    setSelected(next);
  });

  const selectedPiece = usePiece(selected);

  const source = useMemo<RowSource>(() => {
    const invalidateCache = new Map<number, (t: number) => void>();
    const atomCache: Record<number, RowAtom<RowNode<T> | null>> = {};

    const rowCount$ = (x: RowNode<T>[]) => x.length;

    const source: RowSource = {
      rowByIndex: (rowI) => {
        if (!atomCache[rowI]) {
          const $ = (x: RowNode<T>[]) => x[rowI] ?? null;

          const signal = createSignal(Date.now());
          invalidateCache.set(rowI, signal);

          atomCache[rowI] = {
            get: () => piece.get()[rowI],
            useValue: () => {
              // Invalidate is used to invalidate an individual row, and the global signal will invalidate all rows.
              const localSnapshot = useSelector(signal);
              const globalSnapshot = useSelector(globalSignal.current);

              const row = piece.useValue($);

              const selected = selectedPiece.useValue((x) => {
                if (!row) return false;
                if (rowsIsolatedSelection) return x.has(row.id);
                if (row.kind === "leaf") return x.has(row.id);
                const group = treeRef.current?.groupLookup.get(row.id);
                if (!group) return false;

                return group.leafIds.isSubsetOf(x);
              });

              const isIndeterminate = selectedPiece.useValue((x) => {
                if (!row || row.kind === "leaf") return false;
                const group = treeRef.current?.groupLookup.get(row.id);
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
      },
      rowIndexToRowId: (index) => rowByIndexRef.current.get(index)?.id ?? null,
      rowById: (id) => {
        const tree = treeRef.current;
        if (!tree) return leafIdsRef.current.get(id) ?? null;

        const node = tree.groupLookup.get(id)?.row ?? leafIdsRef.current.get(id) ?? null;
        return node;
      },
      rowGroupIsExpanded,
      rowInvalidate: (row?: number) => {
        if (row == null) {
          globalSignal.current(Date.now());
        } else {
          const invalidate = invalidateCache.get(row);
          invalidate?.(Date.now());
        }
      },

      rowsBetween: (startId, endId) => {
        const left = rowIdToRowIndexRef.current.get(startId);
        const right = rowIdToRowIndexRef.current.get(endId);
        if (left == null || right == null) return [];

        const start = Math.min(left, right);
        const end = Math.max(left, right);

        const ids: string[] = [];
        for (let i = start; i < end; i++) {
          const row = source.rowByIndex(i).get();
          if (!row) continue;

          ids.push(row.id);
        }

        return ids;
      },
      rowChildren: (id) => {
        const tree = treeRef.current;
        const group = tree?.groupLookup.get(id);
        if (!group) return [];

        const ids = [...group.children.values()].map((x) => x.row.id);

        return ids;
      },
      rowLeafs: (id) => {
        const tree = treeRef.current;
        const group = tree?.groupLookup.get(id);
        if (!group) return [];

        return [...group.leafIds];
      },
      rowIsSelected,
      rowParents,

      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: () => piece.useValue(rowCount$),

      useMaxRowGroupDepth: maxDepthPiece.useValue,
      useSnapshotVersion: () => 0,

      onRowGroupExpansionsChange: (deltaChanges) => {
        setExpansions((prev) => ({ ...prev, ...deltaChanges }));
      },
      onRowsUpdated: (rows) => {
        if (!handleUpdateRef.current) return;

        const top = new Map<number, T>();
        const center = new Map<number, T>();
        const bottom = new Map<number, T>();

        for (const [row, update] of rows.entries()) {
          if (row.kind === "branch") continue;

          const node = row as RowLeaf<T> & { __srcIndex: number; __pin: string };
          if (node.__pin === "top") top.set(node.__srcIndex, update);
          if (node.__pin === "center") center.set(node.__srcIndex, update);
          if (node.__pin === "bottom") bottom.set(node.__srcIndex, update);
        }

        handleUpdateRef.current({ rows, top, center, bottom });
      },
      onRowsSelected,
    };

    return source;
  }, [
    botPiece.useValue,
    leafIdsRef,
    maxDepthPiece.useValue,
    onRowsSelected,
    piece,
    rowByIndexRef,
    rowGroupIsExpanded,
    rowIdToRowIndexRef,
    rowIsSelected,
    rowParents,
    rowsIsolatedSelection,
    selectedPiece,
    setExpansions,
    topPiece.useValue,
  ]);

  return source;
}
