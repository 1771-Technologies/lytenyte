import type {
  DimensionSort,
  RowAggregated,
  RowLeaf,
  RowNode,
  RowSelectionState,
  RowSource,
  SortFn,
} from "@1771technologies/lytenyte-shared";
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
  useSortFn,
} from "@1771technologies/lytenyte-core/internal";
import { useRowParents } from "./source/use-row-parents.js";
import { useRowLeafs } from "./source/use-row-leafs.js";
import { useRowChildren } from "./source/use-row-children.js";
import { useOnRowsUpdated } from "./source/use-on-rows-updated.js";
import { useRowSiblings } from "./source/use-row-siblings.js";

export interface UseTreeDataSourceParams<T = unknown> {
  readonly topData?: (RowLeaf<T> | RowAggregated)[];
  readonly botData?: (RowLeaf<T> | RowAggregated)[];
  readonly data: Record<string, unknown>;
  readonly idFn?: (path: string[], data: any) => string;

  readonly rowRootFn?: (x: object) => [key: string, child: object][];
  readonly rowValueFn?: (x: any, parent: any, key: string) => any;
  readonly rowChildrenFn?: (x: any, parent: any, key: string) => [key: string, child: object][];

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly onRowGroupExpansionChange?: (state: Record<string, boolean | undefined>) => void;

  readonly sort?: SortFn<any> | DimensionSort<any>[] | null;
  readonly filter?: ((data: any) => boolean) | null;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelectKey?: unknown[];
  readonly rowSelection?: RowSelectionState;
  readonly rowSelectionIdUniverseAdditions?: { readonly id: string; root: boolean }[];
  readonly rowSelectionIdUniverseSubtractions?: Set<string>;

  readonly onRowSelectionChange?: (state: RowSelectionState) => void;

  readonly onRowDataChange?: (params: {
    readonly changes: { next: any; prev: any; parent: any; key: string; path: string[] }[];
    readonly top: Map<number, T>;
    readonly bottom: Map<number, T>;
  }) => void;
}

export interface RowSourceTree<T> extends RowSource<T> {
  readonly rowUpdate: (rows: Map<RowNode<T>, T>) => void;
}

const emptyKey: any[] = [];
export function useTreeDataSource<T>(p: UseTreeDataSourceParams<T>): RowSource {
  const sortFn = useSortFn(p.sort);
  const state = useControlledState(p);

  const tree = useTree(p);
  const flat = useFlattened(
    tree,
    state.expandedFn,
    p.topData,
    p.botData,
    p.rowSelectionIdUniverseAdditions,
    p.rowSelectionIdUniverseSubtractions,
    sortFn,
  );

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
    if (!node) return null;

    return { size: node.children.size, children: node.children };
  });

  const selectionState = useRowSelection(
    p.rowSelection,
    p.onRowSelectionChange,
    p.rowsIsolatedSelection ?? false,
    p.rowSelectKey ?? emptyKey,
    flat.idUniverse,
    flat.rootIds,
    flat.rootCount,
    globalSignal,
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
  const rowSiblings = useRowSiblings(tree);

  const rowIdToIndex = usePiece(flat.idToIndex);

  const setExpansions = state.onExpansionsChange;

  const onRowsUpdated = useOnRowsUpdated(tree, p);

  const selection$ = usePiece(selectionState.rowSelectionsRaw);

  const source = useMemo(() => {
    const s: RowSourceTree<T> = {
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
      rowSiblings,
      rowIndexToRowId: (i) => s.rowByIndex(i).get()?.id ?? null,
      rowIdToRowIndex: (id) => rowIdToIndex.get().get(id) ?? null,
      rowUpdate: onRowsUpdated,

      rowGroupExpansionChange: (delta) => {
        setExpansions(delta);
      },
      onViewChange: () => {},

      useBottomCount: bot$.useValue,
      useRowCount: rowCount$.useValue,
      useTopCount: top$.useValue,
      useRows: rows.useValue,
      useMaxRowGroupDepth: maxDepth$.useValue,
      useSelectionState: selection$.useValue,

      onRowsSelected,
      onRowsUpdated,
    };

    return s;
  }, [
    bot$.useValue,
    maxDepth$.useValue,
    onRowsSelected,
    onRowsUpdated,
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
    rowSiblings,
    rows.useValue,
    rowsBetween,
    rowsSelected,
    selection$.useValue,
    setExpansions,
    top$.useValue,
  ]);

  return source;
}
