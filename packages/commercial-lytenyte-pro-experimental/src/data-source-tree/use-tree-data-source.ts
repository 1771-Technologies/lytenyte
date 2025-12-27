import type { RowAggregated, RowLeaf, RowSelectionState, RowSource } from "@1771technologies/lytenyte-shared";
import { useTree } from "./source/use-tree.js";
import { useMemo } from "react";
import { useRowById } from "./source/use-row-by-id.js";
import { useControlledState } from "./source/use-controlled-state.js";
import { useFlattened } from "./source/use-flattened.js";
import {
  useEvent,
  useGlobalRefresh,
  useOnRowsSelected,
  usePiece,
  useRowByIndex,
  useRowIsSelected,
  useRows,
  useRowsBetween,
  useRowSelection,
  useRowSelectionState,
  useRowsSelected,
} from "@1771technologies/lytenyte-core-experimental/internal";
import { useRowParents } from "./source/use-row-parents.js";
import { useRowLeafs } from "./source/use-row-leafs.js";
import { useRowChildren } from "./source/use-row-children.js";

export interface UseTreeDataSourceParams<T = unknown> {
  readonly topData?: (RowLeaf<T> | RowAggregated)[];
  readonly botData?: (RowLeaf<T> | RowAggregated)[];
  readonly data: Record<string, unknown>;
  readonly idFn?: (path: string[], data: any) => string;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelectKey?: unknown[];
  readonly rowSelection?: RowSelectionState;
  readonly rowSelectionIdUniverseAdditions?: Set<string>;
  readonly onRowSelectionChange?: (state: RowSelectionState) => void;
}

export type RowSourceTree = RowSource;

const emptyKey: any[] = [];
export function UseTreeDataSource<T>(p: UseTreeDataSourceParams<T>): RowSource {
  const tree = useTree(p);
  const state = useControlledState(p);
  const flat = useFlattened(tree, state.expandedFn, p.topData, p.botData, p.rowSelectionIdUniverseAdditions);

  const top$ = usePiece(flat.topCount);
  const bot$ = usePiece(flat.botCount);
  const rowCount$ = usePiece(flat.rowCount);
  const maxDepth$ = usePiece(flat.maxDepth);
  const rows$ = usePiece(flat.rows);
  const rows = useRows(flat.rows);

  const globalSignal = useGlobalRefresh();

  const rowById = useRowById(tree);
  const rowParents = useRowParents(tree);

  const idToSpec = useEvent((id: string) => {
    const node = tree.rowIdToNode.get(id);
    if (!node || node.kind === "leaf") return null;

    return { size: node.children.size, children: node.children };
  });

  const selectionState = useRowSelection(
    p.rowSelection,
    p.onRowSelectionChange,
    p.rowsIsolatedSelection ?? false,
    p.rowSelectKey ?? emptyKey,
    flat.idUniverse,
  );

  const onRowsSelected = useOnRowsSelected(
    selectionState,
    idToSpec,
    rowParents,
    p.rowsIsolatedSelection ?? false,
    globalSignal,
  );

  const rowIsSelected = useRowIsSelected(selectionState, rowParents, rowById);
  const { rowByIndex, rowInvalidate } = useRowByIndex(rows$, globalSignal, selectionState, rowParents);

  const rowsSelected = useRowsSelected(selectionState, tree.rowIdToNode, rowParents);
  const rowSelectionState = useRowSelectionState(selectionState);

  const rowsBetween = useRowsBetween({ current: flat.idToIndex }, rowByIndex);
  const rowLeafs = useRowLeafs(tree);
  const rowChildren = useRowChildren(tree);

  const rowIdToIndex = usePiece(flat.idToIndex);

  const setExpansions = state.setExpansions;

  const source = useMemo(() => {
    const s: RowSourceTree = {
      rowByIndex,
      rowById,
      rowInvalidate,
      rowParents,
      rowIsSelected,
      rowsSelected,
      rowSelectionState,
      rowsBetween,
      rowLeafs,
      rowChildren,
      rowIndexToRowId: (i) => s.rowByIndex(i).get()?.id ?? null,
      rowIdToRowIndex: (id) => rowIdToIndex.get().get(id) ?? null,

      onRowGroupExpansionChange: (delta) => setExpansions((prev) => ({ ...prev, ...delta })),
      onViewChange: () => {},

      useBottomCount: bot$.useValue,
      useRowCount: rowCount$.useValue,
      useTopCount: top$.useValue,
      useRows: rows.useValue,
      useMaxRowGroupDepth: maxDepth$.useValue,

      onRowsSelected,

      onRowsUpdated: () => {},
    };

    return s;
  }, [
    bot$.useValue,
    maxDepth$.useValue,
    onRowsSelected,
    rowById,
    rowByIndex,
    rowChildren,
    rowCount$.useValue,
    rowIdToIndex,
    rowInvalidate,
    rowIsSelected,
    rowLeafs,
    rowParents,
    rowSelectionState,
    rows.useValue,
    rowsBetween,
    rowsSelected,
    setExpansions,
    top$.useValue,
  ]);

  return source;
}
