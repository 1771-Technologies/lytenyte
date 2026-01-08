import { useMemo, type RefObject } from "react";
import type {
  AggregationFn,
  Aggregator,
  ColumnPin,
  Dimension,
  DimensionAgg,
  DimensionSort,
  FilterFn,
  GroupFn,
  GroupIdFn,
  LeafIdFn,
  RowGroup,
  RowLeaf,
  RowNode,
  RowSelectionState,
  RowSource,
  SortFn,
} from "@1771technologies/lytenyte-shared";
import { useSourceState } from "./hooks/use-controlled-ds-state.js";
import {
  useEvent,
  useGlobalRefresh,
  useIdUniverse,
  useLeafNodes,
  useOnRowsSelected,
  useOnRowsUpdated,
  usePiece,
  useRowAdd,
  useRowById,
  useRowByIndex,
  useRowChildren,
  useRowDelete,
  useRowIsSelected,
  useRowLeafs,
  useRowParents,
  useRows,
  useRowsBetween,
  useRowSelection,
  useRowSelectionState,
  useRowSelectSplitLookup,
  useRowSiblings,
} from "@1771technologies/lytenyte-core-experimental/internal";
import type { Column, Field } from "../types/column.js";
import type { GridSpec } from "../types/grid.js";
import { useFlattenedData } from "./hooks/use-flattened-data.js";
import { usePivotData } from "./hooks/use-pivot/use-pivot-data.js";
import type { PivotState } from "./hooks/use-pivot/use-pivot-columns.js";
import type { Props } from "../types/props.js";

export type PivotField<Spec extends GridSpec = GridSpec> = { field?: Field<Spec["data"]> };
export type HavingFilterFn = (node: RowGroup) => boolean;

export interface RowSourceClient<Spec extends GridSpec = GridSpec> extends RowSource<Spec["data"]> {
  readonly usePivotProps: (props?: {
    onColumnsChange?: Props<Spec>["onColumnsChange"];
    onColumnGroupExpansionChange?: Props<Spec>["onColumnGroupExpansionChange"];
  }) => {
    readonly columns?: Column<Spec>[];
    readonly onColumnsChange: Props<Spec>["onColumnsChange"];
    readonly columnGroupExpansions: Props<Spec>["columnGroupExpansions"];
    readonly onColumnGroupExpansionChange: Props<Spec>["onColumnGroupExpansionChange"];
  };

  readonly rowUpdate: (rows: Map<RowNode<Spec["data"]>, Spec["data"]>) => void;
  readonly rowDelete: (rows: RowNode<Spec["data"]>[]) => void;
  readonly rowAdd: (rows: Spec["data"][], placement?: "start" | "end" | number) => void;
}

export type LabelFilter = (s: string | null) => boolean;

export interface PivotModel<Spec extends GridSpec = GridSpec> {
  readonly columns?: (Column<Spec> | PivotField<Spec>)[];
  readonly rows?: (Column<Spec> | PivotField<Spec>)[];
  readonly measures?: { dim: Column<Spec>; fn: Aggregator<Spec["data"]> | string }[];

  readonly sort?: SortFn<Spec["data"]>;
  readonly filter?: HavingFilterFn | (HavingFilterFn | null)[];
  readonly rowLabelFilter?: (LabelFilter | null)[];
  readonly colLabelFilter?: (LabelFilter | null)[];
}

export interface UseClientDataSourceParams<Spec extends GridSpec = GridSpec, T = Spec["data"]> {
  readonly data: T[];
  readonly topData?: T[];
  readonly botData?: T[];

  readonly pivotMode?: boolean;
  readonly pivotModel?: PivotModel<Spec>;
  readonly pivotGrandTotals?: "top" | "bottom" | null;
  readonly pivotColumnProcessor?: (columns: Column<Spec>[]) => Column<Spec>[];
  readonly pivotStateRef?: RefObject<PivotState>;
  readonly pivotApplyExistingFilter?: boolean;
  readonly pivotRowGroupDefaultExpansion?: boolean | number;
  readonly onPivotRowGroupExpansionChange?: (state: Record<string, boolean | undefined>) => void;

  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };
  readonly rowGroupDefaultExpansion?: boolean | number;
  readonly rowGroupCollapseBehavior?: "no-collapse" | "last-only" | "full-tree";
  readonly rowGroupSuppressLeafExpansion?: boolean;
  readonly onRowGroupExpansionChange?: (state: Record<string, boolean | undefined>) => void;

  readonly sort?: SortFn<T> | DimensionSort<T>[] | null;
  readonly group?: GroupFn<T> | Dimension<T>[];
  readonly filter?: FilterFn<T> | FilterFn<T>[] | null;
  readonly aggregate?: AggregationFn<T> | DimensionAgg<T>[];
  readonly aggregateFns?: Record<string, Aggregator<T>>;

  readonly having?: HavingFilterFn | (HavingFilterFn | null)[] | null;
  readonly labelFilter?: (LabelFilter | null)[] | null;

  readonly leafIdFn?: LeafIdFn<T>;
  readonly groupIdFn?: GroupIdFn;

  readonly rowsIsolatedSelection?: boolean;
  readonly rowSelectKey?: unknown[];
  readonly rowSelection?: RowSelectionState;
  readonly rowSelectionIdUniverseAdditions?: Set<string>;
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
export function useClientDataSource<Spec extends GridSpec = GridSpec>(
  props: UseClientDataSourceParams<Spec>,
): RowSourceClient<Spec> {
  type T = Spec["data"];
  const leafsTuple = useLeafNodes(props.topData, props.data, props.botData, props.leafIdFn);

  // s == state, f == flat, p == pivot
  const s = useSourceState(props);
  const d = useFlattenedData(props, leafsTuple, s);
  const p = usePivotData(props, leafsTuple, s);

  const f = props.pivotMode ? p : d;

  const mode = props?.pivotMode === true;
  const piece = usePiece(mode ? p.flatten : d.flatten);

  const botPiece = usePiece(f.leafsBot.length);
  const topPiece = usePiece(f.leafsTop.length);

  const depth = props.group
    ? Array.isArray(props.group)
      ? props.group.length
      : d.maxDepth
    : props.pivotMode && props.pivotModel?.rows?.length
      ? p.maxDepth
      : 0;

  const maxDepthPiece = usePiece(depth);

  const rowById = useRowById(f.tree, f.leafIdsRef);
  const rowParents = useRowParents(rowById, f.tree, f.groupFn, props.groupIdFn ?? groupIdFallback);

  const onRowsUpdated = useOnRowsUpdated(props.onRowDataChange);
  const globalSignal = useGlobalRefresh();

  const idToSpec = useEvent((id: string) => {
    if (!f.tree) return null;

    const node = f.tree.groupLookup.get(id);
    if (!node) return null;

    return { size: node.children.size, children: node.children };
  });

  const rowSelectionKey = useMemo(() => {
    if (props.rowSelectKey) return props.rowSelectKey;

    return [props.group, props.filter];
  }, [props.filter, props.group, props.rowSelectKey]);

  const selectionState = useRowSelection(
    props.rowSelection,
    props.onRowSelectionChange,
    props.rowsIsolatedSelection ?? false,
    rowSelectionKey,
    useIdUniverse(f.tree, f.leafIdsRef.current, props.rowSelectionIdUniverseAdditions),
    globalSignal,
  );

  const onRowsSelected = useOnRowsSelected(
    selectionState,
    idToSpec,
    rowParents,
    props.rowsIsolatedSelection ?? false,
    globalSignal,
  );
  const rowIsSelected = useRowIsSelected(selectionState, rowParents, rowById);
  const rowsSelected = useRowSelectSplitLookup(
    selectionState,
    f.leafIdsRef.current,
    f.tree?.groupLookup,
    rowParents,
  );
  const rowSelectionState = useRowSelectionState(selectionState);

  const { rowInvalidate, rowByIndex } = useRowByIndex(piece, globalSignal, selectionState, rowParents);
  const rowsBetween = useRowsBetween(f.rowIdToRowIndexRef, rowByIndex);

  const rowLeafs = useRowLeafs(f.tree);
  const rowChildren = useRowChildren(f.tree);

  const setExpansions = s.onExpansionsChange;
  const setPivotState = p.setPivotState;
  const setPivotGroupState = p.setPivotGroupState;
  const setPivotRowGroupExpansions = s.onPivotExpansionsChange;

  const mode$ = usePiece(mode);

  const flat = piece.get();

  const rowAdd = useRowAdd(props);
  const rowDelete = useRowDelete(props, rowById);
  const rows$ = useRows(flat);
  const rowSiblings = useRowSiblings(f.tree);

  const selection$ = usePiece(selectionState.rowSelectionsRaw);

  const source = useMemo<RowSourceClient<Spec>>(() => {
    const rowCount$ = (x: RowNode<T>[]) => x.length;

    const source: RowSourceClient<Spec> = {
      rowInvalidate,
      rowByIndex,
      rowIndexToRowId: (index) => f.rowByIndexRef.current.get(index)?.id ?? null,
      rowIdToRowIndex: (id: string) => f.rowIdToRowIndexRef.current.get(id) ?? null,
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

      rowGroupExpansionChange: (deltaChanges) => {
        if (mode$.get()) setPivotRowGroupExpansions(deltaChanges);
        else setExpansions(deltaChanges);
      },
      onRowsSelected,
      onRowsUpdated,
      onViewChange: () => {},

      usePivotProps: (params) => {
        const { onColumnGroupExpansionChange, onColumnsChange } = params ?? {};
        const pivotColumns = p.pivotPiece.useValue() as Column<Spec>[] | null;
        const pivotGroups = p.pivotGroupPiece.useValue();

        return useMemo<ReturnType<RowSourceClient<Spec>["usePivotProps"]>>(() => {
          const object: any = {};

          if (pivotColumns) object.columns = pivotColumns;
          if (pivotColumns) object.columnGroupExpansions = pivotGroups.value;

          const onColChange: Required<Props<Spec>>["onColumnsChange"] = (columns) => {
            if (!mode$.get()) return onColumnsChange?.(columns);

            const ordering = columns.map((x) => x.id);
            const resizingEntries = columns
              .map((x) => (x.width == null ? null : [x.id, x.width]))
              .filter(Boolean) as [string, number][];
            const pinnedEntries = columns
              .map((x) => (x.pin === undefined ? null : [x.id, x.pin]))
              .filter(Boolean) as [string, ColumnPin][];

            setPivotState({
              value: {
                ordering,
                resizing: Object.fromEntries(resizingEntries),
                pinning: Object.fromEntries(pinnedEntries),
              },
            });
          };
          const onColumnGroup: Required<Props<Spec>>["onColumnGroupExpansionChange"] = (change) => {
            if (!mode$.get()) return onColumnGroupExpansionChange?.(change);
            setPivotGroupState({ value: change });
          };

          object.onColumnsChange = onColChange;
          object.onColumnGroupExpansionChange = onColumnGroup;

          return object;
        }, [onColumnGroupExpansionChange, onColumnsChange, pivotColumns, pivotGroups]);
      },
    };

    return source;
  }, [
    rowInvalidate,
    rowByIndex,
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
    onRowsUpdated,
    rowSiblings,
    botPiece.useValue,
    topPiece.useValue,
    selection$.useValue,
    maxDepthPiece.useValue,
    onRowsSelected,
    f.rowByIndexRef,
    f.rowIdToRowIndexRef,
    piece,
    rows$,
    mode$,
    setPivotRowGroupExpansions,
    setExpansions,
    p.pivotPiece,
    p.pivotGroupPiece,
    setPivotState,
    setPivotGroupState,
  ]);

  return source;
}
