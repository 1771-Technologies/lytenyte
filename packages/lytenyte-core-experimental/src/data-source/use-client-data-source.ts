import { useMemo, useRef } from "react";
import type {
  AggregationFn,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
  RowNode,
  RowSource,
  DimensionSort,
  SortFn,
  Dimension,
  DimensionAgg,
  Aggregator,
  RowSelectionState,
  RowLeaf,
} from "@1771technologies/lytenyte-shared";
import { useRowAdd } from "../data-source-shared/use-row-add.js";
import { usePiece } from "../hooks/use-piece.js";
import { useFlattenedPiece } from "./hooks/use-flattened-piece.js";
import { useLeafNodes } from "../data-source-shared/use-leaf-nodes.js";
import { useFiltered } from "../data-source-shared/use-filtered.js";
import { useSorted } from "../data-source-shared/use-sorted.js";
import { useGroupTree } from "./hooks/use-group-tree.js";
import { useFlattenedGroups } from "./hooks/use-flattened-groups.js";
import { useControlledState } from "./hooks/use-controlled-ds-state.js";
import { useOnRowsUpdated } from "../data-source-shared/use-on-rows-updated.js";
import { useGlobalRefresh } from "../data-source-shared/use-global-refresh.js";
import { useRowById } from "../data-source-shared/use-row-by-id.js";
import { useRowParents } from "../data-source-shared/use-row-parents.js";
import { useRowLeafs } from "../data-source-shared/use-row-leafs.js";
import { useRowChildren } from "../data-source-shared/use-row-children.js";
import { useRowByIndex } from "../data-source-shared/use-row-by-index.js";
import { useRowsBetween } from "../data-source-shared/use-rows-between.js";
import { useSortFn } from "../data-source-shared/use-sort-fn.js";
import { useFilterFn } from "../data-source-shared/use-filter-fn.js";
import { useGroupFn } from "../data-source-shared/use-group-fn.js";
import { useAggregationFn } from "../data-source-shared/use-aggregation-fn.js";
import { useRowSelectSplitLookup } from "../data-source-shared/row-selection/use-rows-selected.js";
import { useIdUniverse } from "../data-source-shared/use-id-universe.js";
import { useRows } from "../data-source-shared/use-rows.js";
import { useRowDelete } from "../data-source-shared/use-row-delete.js";
import { useRowIsSelected } from "../data-source-shared/row-selection/use-row-is-selected.js";
import { useOnRowsSelected } from "../data-source-shared/row-selection/use-on-rows-selected.js";
import { useRowSelection } from "../data-source-shared/row-selection/use-row-selection.js";
import { useEvent } from "../hooks/use-event.js";
import { useRowSelectionState } from "../data-source-shared/use-row-selection-state.js";
import { useRowSiblings } from "../data-source-shared/use-row-siblings.js";

export interface RowSourceClient<T> extends RowSource<T> {
  readonly rowUpdate: (rows: Map<RowNode<T>, T>) => void;
  readonly rowDelete: (rows: RowNode<T>[]) => void;
  readonly rowAdd: (rows: T[], placement?: "start" | "end" | number) => void;
}

export interface UseClientDataSourceParams<T = unknown> {
  readonly data: T[];
  readonly topData?: T[];
  readonly bottomData?: T[];

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly onRowGroupExpansionChange?: (state: Record<string, boolean | undefined>) => void;

  readonly sort?: SortFn<T> | DimensionSort<T>[] | null;
  readonly filter?: FilterFn<T> | FilterFn<T>[] | null;
  readonly group?: GroupFn<T> | Dimension<T>[];
  readonly aggregate?: AggregationFn<T> | DimensionAgg<T>[];
  readonly aggregateFns?: Record<string, Aggregator<T>>;

  readonly leafIdFn?: LeafIdFn<T>;
  readonly groupIdFn?: GroupIdFn;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelection?: RowSelectionState;
  readonly rowSelectKey?: unknown[];
  readonly rowSelectionIdUniverseAdditions?: { readonly id: string; readonly root: boolean }[];
  readonly rowSelectionIdUniverseSubtractions?: Set<string>;

  readonly onRowSelectionChange?: (state: RowSelectionState) => void;

  readonly onRowsAdded?: (params: {
    newData: T[];
    placement: "start" | "end" | number;
    top: T[];
    center: T[];
    bottom: T[];
  }) => void;
  readonly onRowsDeleted?: (params: {
    rows: RowLeaf<T>[];
    sourceIndices: number[];
    top: T[];
    center: T[];
    bottom: T[];
  }) => void;
  readonly onRowDataChange?: (params: {
    readonly rows: Map<RowNode<T>, T>;
    readonly top: Map<number, T>;
    readonly bottom: Map<number, T>;
    readonly center: Map<number, T>;
  }) => void;
}

const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function useClientDataSource<T>(p: UseClientDataSourceParams<T>): RowSource<T> {
  const sortFn = useSortFn(p.sort);
  const filterFn = useFilterFn(p.filter);
  const groupFn = useGroupFn(p.group);
  const aggregate = useAggregationFn(p.aggregate, p.aggregateFns);

  const { expandedFn, onExpansionsChange } = useControlledState(p);

  const [leafsTop, leafs, leafsBot, pinMap] = useLeafNodes(p.topData, p.data, p.bottomData, p.leafIdFn);
  const filtered = useFiltered(leafs, filterFn);
  const [sorted, centerMap] = useSorted(leafs, sortFn, filtered);

  const leafIds = useMemo(() => new Map([...centerMap, ...pinMap]), [centerMap, pinMap]);
  const leafIdsRef = useRef(leafIds);
  leafIdsRef.current = leafIds;

  const tree = useGroupTree(leafs, sorted, groupFn, p.groupIdFn ?? groupIdFallback);
  const [groupFlat, maxDepth] = useFlattenedGroups(tree, aggregate, leafs, sorted, sortFn, expandedFn);

  const { idUniverse, rootIds } = useIdUniverse(
    tree,
    leafIds,
    p.rowSelectionIdUniverseAdditions,
    p.rowSelectionIdUniverseSubtractions,
  );

  const {
    flatten,
    flatten$: piece,
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

  const rowById = useRowById(tree, leafIdsRef);
  const rowParents = useRowParents(rowById, tree, groupFn, p.groupIdFn ?? groupIdFallback);
  const onRowsUpdated = useOnRowsUpdated(p.onRowDataChange);

  const globalSignal = useGlobalRefresh();

  const idToSpec = useEvent((id: string) => {
    if (!tree) return null;

    const node = tree.groupLookup.get(id);
    if (!node) return null;

    return { size: node.children.size, children: node.children };
  });

  const rowSelectionKey = useMemo(() => {
    return [p.group, p.filter];
  }, [p.filter, p.group]);

  const selectionState = useRowSelection(
    p.rowSelection,
    p.onRowSelectionChange,
    p.rowsIsolatedSelection ?? false,
    rowSelectionKey,
    idUniverse,
    rootIds,
    rootIds.size,
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
  const rowsSelected = useRowSelectSplitLookup(
    selectionState,
    leafIdsRef.current,
    tree?.groupLookup,
    rowParents,
  );
  const rowSelectionState = useRowSelectionState(selectionState);

  const { rowInvalidate, rowByIndex } = useRowByIndex(piece, globalSignal, selectionState, rowParents);
  const rowsBetween = useRowsBetween(rowIdToRowIndexRef, rowByIndex);

  const rowLeafs = useRowLeafs(tree);
  const rowChildren = useRowChildren(tree);

  const rowAdd = useRowAdd(p);
  const rowDelete = useRowDelete(p, rowById);
  const rows$ = useRows(flatten);

  const selection$ = usePiece(selectionState.rowSelectionsRaw);

  const rowSiblings = useRowSiblings(tree);

  const source = useMemo<RowSourceClient<T>>(() => {
    const rowCount$ = (x: RowNode<T>[]) => x.length;

    const source: RowSourceClient<T> = {
      rowInvalidate,
      rowByIndex,
      rowIndexToRowId: (index) => rowByIndexRef.current.get(index)?.id ?? null,
      rowIdToRowIndex: (id: string) => rowIdToRowIndexRef.current.get(id) ?? null,
      rowById,
      rowsBetween,
      rowChildren,
      rowLeafs,
      rowIsSelected,
      rowsSelected,
      rowParents,
      rowSelectionState,
      rowAdd,
      rowDelete,
      rowUpdate: onRowsUpdated,
      rowSiblings,

      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: () => piece.useValue(rowCount$),
      useRows: () => rows$.useValue(),

      useSelectionState: selection$.useValue,

      useMaxRowGroupDepth: maxDepthPiece.useValue,

      rowGroupExpansionChange: (deltaChanges) => onExpansionsChange(deltaChanges),
      onRowsSelected,
      onRowsUpdated,
      // Not used by the core data source
      onViewChange: () => {},
    };

    return source;
  }, [
    botPiece.useValue,
    maxDepthPiece.useValue,
    onExpansionsChange,
    onRowsSelected,
    onRowsUpdated,
    piece,
    rowAdd,
    rowById,
    rowByIndex,
    rowByIndexRef,
    rowChildren,
    rowDelete,
    rowIdToRowIndexRef,
    rowInvalidate,
    rowIsSelected,
    rowLeafs,
    rowParents,
    rowSelectionState,
    rowSiblings,
    rows$,
    rowsBetween,
    rowsSelected,
    selection$.useValue,
    topPiece.useValue,
  ]);

  return source;
}
