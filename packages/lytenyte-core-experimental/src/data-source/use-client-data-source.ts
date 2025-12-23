import { useMemo, useRef } from "react";
import type {
  AggregationFn,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
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
import { useFlattenedGroups } from "./hooks/use-flattened-groups.js";
import { useControlledState } from "./hooks/use-controlled-ds-state.js";
import { useRowGroupIsExpanded } from "./source-functions/use-row-group-is-expanded.js";
import { useOnRowsUpdated } from "./source-functions/use-on-rows-updated.js";
import { useGlobalRefresh } from "./source-functions/use-global-refresh.js";
import { useRowById } from "./source-functions/use-row-by-id.js";
import { useRowParents } from "./source-functions/use-row-parents.js";
import { useRowIsSelected } from "./source-functions/use-row-is-selected.js";
import { useOnRowsSelected } from "./source-functions/use-on-rows-selected.js";
import { useRowsSelected } from "./source-functions/use-rows-selected.js";
import { useRowLeafs } from "./source-functions/use-row-leafs.js";
import { useRowChildren } from "./source-functions/use-row-children.js";
import { useRowByIndex } from "./source-functions/use-row-by-index.js";
import { useRowsBetween } from "./source-functions/use-rows-between.js";

export interface UseClientDataSourceParams<T = unknown> {
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
export function useClientDataSource<T>(props: UseClientDataSourceParams<T>) {
  const {
    data,
    topData,
    botData,
    filter,
    sort,
    group,
    aggregate,

    leafIdFn,

    rowsIsolatedSelection = false,
  } = props;

  const { expandedFn, expansions, selected, setExpansions, setSelected } = useControlledState(props);

  const [leafsTop, leafs, leafsBot, leafIdsRef] = useLeafNodes(topData, data, botData, leafIdFn);
  const filtered = useFiltered(leafs, filter);
  const sorted = useSorted(leafs, sort, filtered);

  const tree = useGroupTree(leafs, sorted, group, props.groupIdFn ?? groupIdFallback);
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

  const rowById = useRowById(tree, leafIdsRef);
  const rowParents = useRowParents(rowById, tree, group, props.groupIdFn ?? groupIdFallback);
  const rowGroupIsExpanded = useRowGroupIsExpanded(rowByIdRef, expansions, props.rowGroupDefaultExpansion);
  const onRowsUpdated = useOnRowsUpdated(props.onRowDataChange);

  const globalSignal = useGlobalRefresh();

  const rowIsSelected = useRowIsSelected(rowById, selected, tree, rowsIsolatedSelection ?? false);
  const onRowsSelected = useOnRowsSelected(
    rowById,
    selected,
    setSelected,
    tree,
    sorted,
    leafs,
    leafsTop,
    leafsBot,
    rowsIsolatedSelection ?? false,
  );

  const rowsSelected: RowSource["rowsSelected"] = useRowsSelected(
    rowById,
    selected,
    rowsIsolatedSelection ?? false,
  );

  const { rowInvalidate, rowByIndex } = useRowByIndex(
    tree,
    piece,
    globalSignal,
    selected,
    rowsIsolatedSelection ?? false,
  );
  const rowsBetween = useRowsBetween(rowIdToRowIndexRef, rowByIndex);

  const rowLeafs = useRowLeafs(tree);
  const rowChildren = useRowChildren(tree);

  const source = useMemo<RowSource>(() => {
    const rowCount$ = (x: RowNode<T>[]) => x.length;

    const source: RowSource = {
      rowInvalidate,
      rowByIndex,
      rowIndexToRowId: (index) => rowByIndexRef.current.get(index)?.id ?? null,
      rowIdToRowIndex: (id: string) => rowIdToRowIndexRef.current.get(id) ?? null,
      rowById,
      rowGroupIsExpanded,
      rowsBetween,
      rowChildren,
      rowLeafs,
      rowIsSelected,
      rowsSelected,
      rowParents,

      useBottomCount: botPiece.useValue,
      useTopCount: topPiece.useValue,
      useRowCount: () => piece.useValue(rowCount$),

      useMaxRowGroupDepth: maxDepthPiece.useValue,
      useSnapshotVersion: () => 0,

      onRowGroupExpansionsChange: (deltaChanges) => {
        setExpansions((prev) => ({ ...prev, ...deltaChanges }));
      },
      onRowsSelected,
      onRowsUpdated,
    };

    return source;
  }, [
    botPiece.useValue,
    maxDepthPiece.useValue,
    onRowsSelected,
    onRowsUpdated,
    piece,
    rowById,
    rowByIndex,
    rowByIndexRef,
    rowChildren,
    rowGroupIsExpanded,
    rowIdToRowIndexRef,
    rowInvalidate,
    rowIsSelected,
    rowLeafs,
    rowParents,
    rowsBetween,
    rowsSelected,
    setExpansions,
    topPiece.useValue,
  ]);

  return source;
}
