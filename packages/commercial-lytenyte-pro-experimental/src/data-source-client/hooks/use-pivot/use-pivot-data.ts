import { useMemo, useRef } from "react";
import type { GridSpec } from "../../../types";
import type { UseClientDataSourceParams } from "../../use-client-data-source";
import type { SourceState } from "../use-controlled-ds-state";
import { useFilteredData } from "./use-filtered-data.js";
import { usePivotGroupFn } from "./use-pivot-group-fn.js";
import { useGroupTree } from "../use-group-tree/use-group-tree.js";
import { type GroupIdFn, type RowAggregated, type RowLeaf } from "@1771technologies/lytenyte-shared";
import { useFlattenedGroups } from "../use-flattened-groups.js";
import { useFlattenedPiece } from "../use-flattened-piece.js";
import { usePivotColumns } from "./use-pivot-columns.js";
import { usePivotAggFunction } from "./use-agg-model.js";
import {
  useFilterFn,
  usePiece,
  useSortFn,
  type LeafNodeTuple,
} from "@1771technologies/lytenyte-core-experimental/internal";
import { type ControlledPivotState } from "./use-pivot-state.js";

const empty: RowLeaf<any>[] = [];
const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function usePivotData<Spec extends GridSpec>(
  props: UseClientDataSourceParams<Spec>,
  [, leafs, , pinMap]: LeafNodeTuple<Spec["data"]>,
  c: SourceState,
  controlled: ControlledPivotState,
) {
  const model = props.pivotModel;
  const pivotMode = props.pivotMode ?? false;

  const sortFn = useSortFn(model?.sort);

  const filterFn = useFilterFn(props.filter);
  const filter = props.pivotApplyExistingFilter ? filterFn : null;

  const filtered = useFilteredData(pivotMode, filter, leafs);
  const groupFn = usePivotGroupFn(pivotMode, model);

  const leafIds = useMemo(() => {
    const centerMap = new Map(pinMap);

    for (let i = 0; i < filtered.length; i++) {
      const row = leafs[filtered[i]];
      centerMap.set(row.id, row);
    }
    return centerMap;
  }, [filtered, leafs, pinMap]);
  const leafIdsRef = useRef(leafIds);
  leafIdsRef.current = leafIds;

  const measures = model?.measures;
  const rows = model?.rows;

  const pivotColumns = usePivotColumns(
    pivotMode,
    controlled,
    model,
    leafs,
    filtered,
    props.pivotColumnProcessor,
  );
  const aggFn = usePivotAggFunction(pivotColumns, model, props.aggregateFns);

  const tree = useGroupTree(
    leafs,
    filtered,
    groupFn,
    props.groupIdFn ?? groupIdFallback,
    "no-collapse",
    model?.rowLabelFilter,
    model?.filter,
    aggFn,
  );

  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    aggFn,
    leafs,
    filtered,
    sortFn,
    c.pivotExpandedFn,
    true,
    true,
  );

  const grandTotalRow = props.pivotGrandTotals;
  const grandTotal = useMemo(() => {
    if (!grandTotalRow || !aggFn) return empty;

    const rows = filtered.map((x) => leafs[x]);
    const agg = aggFn(rows);

    return [{ id: "ln-pivot-grand-total", data: agg, kind: "aggregated", depth: 0 } satisfies RowAggregated];
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
  const pivotGroupPiece = usePiece(controlled.pivotGroupState);

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
    groupFn,
  };
}
