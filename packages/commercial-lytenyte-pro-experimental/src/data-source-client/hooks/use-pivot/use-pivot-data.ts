import { useMemo } from "react";
import type { GridSpec } from "../../../types";
import type { UseClientDataSourceParams } from "../../use-client-data-source";
import type { SourceState } from "../use-controlled-ds-state";
import type { LeafRowTuple } from "../use-leaf-nodes";
import { useFilteredData } from "./use-filtered-data.js";
import { usePivotGroupFn } from "./use-pivot-group-fn.js";
import { useGroupTree } from "../use-group-tree/use-group-tree.js";
import { type GroupIdFn, type RowAggregated, type RowLeaf } from "@1771technologies/lytenyte-shared";
import { useFlattenedGroups } from "../use-flattened-groups.js";
import { useFlattenedPiece } from "../use-flattened-piece.js";
import { usePivotColumns } from "./use-pivot-columns.js";
import { usePivotAggFunction } from "./use-agg-model.js";
import { usePiece } from "@1771technologies/lytenyte-core-experimental/internal";

const empty: RowLeaf<any>[] = [];
const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function usePivotData<Spec extends GridSpec>(
  props: UseClientDataSourceParams<Spec>,
  [, leafs, , leafIdsRef]: LeafRowTuple<Spec["data"]>,
  c: SourceState,
) {
  const model = props.pivotModel;
  const pivotMode = props.pivotMode ?? false;

  const filter = props.pivotApplyExistingFilter ? props.filter : null;
  const filtered = useFilteredData(pivotMode, filter, leafs);
  const groupFn = usePivotGroupFn(pivotMode, model);

  const measures = model?.measures;
  const rows = model?.rows;

  const { pivotColumns, setPivotState, setPivotGroupState, pivotGroupState } = usePivotColumns(
    pivotMode,
    model,
    leafs,
    filtered,
    props.pivotColumnProcessor,
    props.pivotStateRef,
  );
  const aggFn = usePivotAggFunction(pivotColumns, model);

  const havingFilter = Array.isArray(model?.filter)
    ? model.filter.length
      ? model.filter
      : null
    : model?.filter;
  const tree = useGroupTree(
    leafs,
    filtered,
    groupFn,
    props.groupIdFn ?? groupIdFallback,
    "no-collapse",
    model?.rowLabelFilter,
    havingFilter,
    props.pivotHavingGroupingAlways ?? props.havingGroupAlways ?? false,
    aggFn,
  );

  const groupSort = Array.isArray(model?.sort) ? (model.sort.length ? model.sort : null) : model?.sort;
  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    aggFn,
    leafs,
    filtered,
    groupSort,
    props.pivotSortGroupAlways ?? props.sortGroupAlways ?? true,
    c.pivotExpandedFn,
    true,
  );

  const grandTotalRow = props.pivotGrandTotals;
  const grandTotal = useMemo(() => {
    if (!grandTotalRow || !aggFn) return empty;

    const rows = filtered.map((x) => leafs[x]);
    const agg = aggFn(rows);

    return [{ id: "ln-pivot-grand-total", data: agg, kind: "aggregated" } satisfies RowAggregated];
  }, [aggFn, filtered, grandTotalRow, leafs]);

  const top = grandTotalRow === "top" ? grandTotal : empty;
  const bot = grandTotalRow === "bottom" ? grandTotal : empty;

  const { flatten, rowByIdRef, rowByIndexRef, rowIdToRowIndexRef } = useFlattenedPiece({
    leafsTop: top,
    leafsCenter: leafs,
    leafsBot: bot,
    groupFlat,
    centerIndices: filtered,
  });

  const pivotPiece = usePiece(pivotColumns);
  const pivotGroupPiece = usePiece(pivotGroupState);

  const trueMaxDepth = useMemo(() => {
    if (!model?.rows?.length) return 0;

    return maxDepth;
  }, [maxDepth, model?.rows?.length]);

  const finalFlat = useMemo(() => {
    if (!measures?.length && !rows?.length) return [];
    return flatten;
  }, [flatten, measures?.length, rows?.length]);

  return {
    tree,
    maxDepth: trueMaxDepth,
    flatten: finalFlat,
    rowByIdRef,
    rowByIndexRef,
    rowIdToRowIndexRef,
    leafIdsRef,
    leafsTop: top,
    leafs,
    leafsBot: bot,
    sorted: filtered,
    pivotPiece,
    pivotGroupPiece,
    setPivotState,
    setPivotGroupState,
  };
}
