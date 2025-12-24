import { useMemo } from "react";
import type {
  AggregationFn,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
  RowGroup,
  RowLeaf,
  RowNode,
  RowSource,
  SortFn,
} from "@1771technologies/lytenyte-shared";
import { useLeafNodes } from "./hooks/use-leaf-nodes.js";
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
import { usePiece } from "@1771technologies/lytenyte-core-experimental/internal";
import type { Column, Field } from "../types/column.js";
import type { GridSpec } from "../types/grid.js";
import { useFlattenedData } from "./hooks/use-flattened-data.js";
import { usePivotData } from "./hooks/use-pivot/use-pivot-data.js";

export type HavingFilterFn = (node: RowGroup) => boolean;

export type PivotField<Spec extends GridSpec = GridSpec> = { field?: Field<Spec["data"]> };
export type PivotMeasure<Spec extends GridSpec = GridSpec> = {
  id: string;
  measure: (rows: RowLeaf<Spec["data"]>[]) => unknown;
  reference?: Omit<Column<Spec>, "id">;
};
export type PivotLabelFilter = (s: string) => boolean;

export interface RowSourceClient<Spec extends GridSpec = GridSpec> extends RowSource<Spec["data"]> {
  readonly usePivotColumns: () => null | Column<Spec>[];
}

export interface PivotModel<Spec extends GridSpec> {
  readonly pivotMode: boolean;
  readonly columns?: (Column<Spec> | PivotField<Spec>)[];
  readonly rows?: (Column<Spec> | PivotField<Spec>)[];
  readonly measures?: PivotMeasure<Spec>[];
  readonly sort?: SortFn<Spec["data"]> | SortFn<Spec["data"]>[];
  readonly rowLabelFilter?: HavingFilterFn[];
  readonly colLabelFilter?: HavingFilterFn[];
}

export interface UseClientDataSourceParams<Spec extends GridSpec = GridSpec, T = Spec["data"]> {
  readonly data: T[];
  readonly topData?: T[];
  readonly botData?: T[];

  readonly pivotModel?: PivotModel<Spec>;
  readonly pivotGroupExpansion?: { [rowId: string]: boolean | undefined };
  readonly pivotApplyExistingFilter?: boolean;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly rowGroupCollapseBehavior?: "no-collapse" | "last-only" | "full-tree";
  readonly rowGroupSuppressLeafExpansion?: boolean;

  readonly sort?: SortFn<T> | SortFn<T>[];
  readonly sortGroupAlways?: boolean;

  readonly filter?: FilterFn<T>;
  readonly having?: HavingFilterFn | HavingFilterFn[];
  readonly havingGroupAlways?: boolean;
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
export function useClientDataSource<Spec extends GridSpec = GridSpec>(
  props: UseClientDataSourceParams<Spec>,
): RowSourceClient<Spec> {
  type T = Spec["data"];
  const rowsIsolatedSelection = props.rowsIsolatedSelection ?? false;
  const leafsTuple = useLeafNodes(props);

  // s == state, f == flat, p == pivot
  const s = useControlledState(props);
  const d = useFlattenedData(props, leafsTuple, s);
  const p = usePivotData(props, leafsTuple, s);

  const f = props.pivotModel?.pivotMode ? p : d;

  const mode = props.pivotModel?.pivotMode === true;
  const piece = usePiece(mode ? p.flatten : d.flatten);

  const botPiece = usePiece(f.leafsBot.length);
  const topPiece = usePiece(f.leafsTop.length);
  const maxDepthPiece = usePiece(f.maxDepth);

  const rowById = useRowById(f.tree, f.leafIdsRef);
  const rowParents = useRowParents(rowById, f.tree, props.group, props.groupIdFn ?? groupIdFallback);
  const rowGroupIsExpanded = useRowGroupIsExpanded(
    f.rowByIdRef,
    s.expansions,
    props.rowGroupDefaultExpansion,
  );
  const onRowsUpdated = useOnRowsUpdated(props.onRowDataChange);

  const rowIsSelected = useRowIsSelected(rowById, s.selected, f.tree, rowsIsolatedSelection);
  const onRowsSelected = useOnRowsSelected(
    rowById,
    s.selected,
    s.setSelected,
    f.tree,
    f.sorted,
    f.leafs,
    f.leafsTop,
    f.leafsBot,
    rowsIsolatedSelection,
  );

  const rowsSelected: RowSource["rowsSelected"] = useRowsSelected(rowById, s.selected, rowsIsolatedSelection);

  const globalSignal = useGlobalRefresh();
  const { rowInvalidate, rowByIndex } = useRowByIndex(
    f.tree,
    piece,
    globalSignal,
    s.selected,
    rowsIsolatedSelection,
  );
  const rowsBetween = useRowsBetween(f.rowIdToRowIndexRef, rowByIndex);

  const rowLeafs = useRowLeafs(f.tree);
  const rowChildren = useRowChildren(f.tree);

  const setExpansions = s.setExpansions;

  const source = useMemo<RowSourceClient<Spec>>(() => {
    const rowCount$ = (x: RowNode<T>[]) => x.length;

    const source: RowSourceClient<Spec> = {
      rowInvalidate,
      rowByIndex,
      rowIndexToRowId: (index) => f.rowByIndexRef.current.get(index)?.id ?? null,
      rowIdToRowIndex: (id: string) => f.rowIdToRowIndexRef.current.get(id) ?? null,
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

      usePivotColumns: () => p.pivotPiece.useValue() as Column<Spec>[] | null,
    };

    return source;
  }, [
    rowInvalidate,
    rowByIndex,
    rowById,
    rowGroupIsExpanded,
    rowsBetween,
    rowChildren,
    rowLeafs,
    rowIsSelected,
    rowsSelected,
    rowParents,
    botPiece.useValue,
    topPiece.useValue,
    maxDepthPiece.useValue,
    onRowsSelected,
    onRowsUpdated,
    p.pivotPiece,
    f.rowByIndexRef,
    f.rowIdToRowIndexRef,
    piece,
    setExpansions,
  ]);

  return source;
}
