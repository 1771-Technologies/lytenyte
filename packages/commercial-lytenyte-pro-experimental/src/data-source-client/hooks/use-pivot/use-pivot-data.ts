import { useMemo } from "react";
import type { GridSpec } from "../../../types";
import type { UseClientDataSourceParams } from "../../use-client-data-source";
import type { Controlled } from "../use-controlled-ds-state";
import type { LeafRowTuple } from "../use-leaf-nodes";
import { useFilteredData } from "./use-filtered-data.js";
import { usePivotGroupFn } from "./use-pivot-group-fn.js";
import type { Column } from "@1771technologies/lytenyte-core-experimental/types";
import { useGroupTree } from "../use-group-tree/use-group-tree.js";
import type { AggregationFn } from "@1771technologies/lytenyte-shared";
import { type GroupIdFn, type RowLeaf } from "@1771technologies/lytenyte-shared";
import { useFlattenedGroups } from "../use-flattened-groups.js";
import { useFlattenedPiece } from "../use-flattened-piece.js";
import { computeField, usePiece } from "@1771technologies/lytenyte-core-experimental/internal";
import { pivotPathsWithTotals } from "./auxiliary-functions/pivot-paths-with-totals.js";

const empty: RowLeaf<any>[] = [];
const groupIdFallback: GroupIdFn = (p) => p.map((x) => (x == null ? "_null_" : x)).join("->");
export function usePivotData<Spec extends GridSpec>(
  props: UseClientDataSourceParams<Spec>,
  [, leafs, , leafIdsRef]: LeafRowTuple<Spec["data"]>,
  c: Controlled,
) {
  const model = props.pivotModel;
  const pivotMode = model?.pivotMode ?? false;

  const filter = props.pivotApplyExistingFilter ? props.filter : null;
  const filtered = useFilteredData(pivotMode, filter, leafs);
  const groupFn = usePivotGroupFn(pivotMode, model);

  const measures = model?.measures;
  const columns = model?.columns;
  const rows = model?.rows;

  const pivotColumns = useMemo<Column<Spec>[] | null>(() => {
    if (!pivotMode) return null;
    if (!measures?.length && !columns?.length) return [];

    // There are only measures, hence each measure should become a column.
    if (!columns?.length) {
      return measures!.map<Column<Spec>>((x) => {
        const column: Column<Spec> = {
          ...((x.reference as Column<Spec>) ?? {}),
          id: x.id,
          field: x.id,
        };
        return column;
      });
    }

    // There are only columns.
    const pathSet = new Set<string>();
    for (let i = 0; i < filtered.length; i++) {
      const row = leafs[filtered[i]];
      const current: string[] = [];
      for (const c of columns) {
        const field = c.field ?? (c as any).id;
        const value = field ? computeField(field, row) : null;

        const pivotKey = value == null ? `ln__blank__` : String(value);
        current.push(pivotKey);
      }

      if (measures?.length) {
        for (const measure of measures) {
          pathSet.add([...current, measure.id].join("-->"));
        }
      } else {
        current.push("ln__noop");
        pathSet.add(current.join("-->"));
      }
    }
    const paths = [...pathSet];

    const pathsWithTotals = pivotPathsWithTotals(paths);

    const lookup = Object.fromEntries((measures ?? []).map((x) => [x.id, x]));

    const cols = pathsWithTotals.map((path) => {
      const parts = path.split("-->").map((x) => (x === "ln__blank__" ? "(blank)" : x));
      if (parts.length === 1) {
        return { id: path };
      }

      const measureId = parts.at(-1)!;
      // const measure = lookup[measureId];

      // Pop the last part as this is the aggregation value
      parts.pop();

      let name = measureId === "ln__noop" || measures?.length === 1 ? parts.at(-1)! : measureId;
      if (name === "ln__grand_total") name = "Grand Total";
      if (name === "ln__total") name = "Total";

      const group = (
        parts.length === 1
          ? undefined
          : !measures?.length || measures.length === 1
            ? parts.slice(0, -1)
            : parts
      )?.map((x) => (x === "ln__total" ? "Total" : x));
      const column: Column<Spec> = {
        id: path,
        name,
        groupPath: group,
      };
      return column;
    });

    return cols;
  }, [columns, filtered, leafs, measures, pivotMode]);

  const aggFn = useMemo<AggregationFn<Spec["data"]> | null>(() => {
    if (!measures?.length) return null;

    return (rows) => {
      const aggResult: Record<string, unknown> = {};

      for (const m of measures!) aggResult[m.id] = m.measure(rows);

      return aggResult;
    };
  }, [measures]);

  const havingFilter = null;
  const tree = useGroupTree(
    leafs,
    filtered,
    groupFn,
    props.groupIdFn ?? groupIdFallback,
    props.rowGroupCollapseBehavior ?? "no-collapse",
    havingFilter,
    props.havingGroupAlways ?? false,
    aggFn,
  );

  const groupSort = null;
  const [groupFlat, maxDepth] = useFlattenedGroups(
    tree,
    aggFn,
    leafs,
    filtered,
    groupSort,
    props.sortGroupAlways ?? true,
    c.expandedFn,
    props.rowGroupSuppressLeafExpansion ?? false,
  );

  const { flatten, rowByIdRef, rowByIndexRef, rowIdToRowIndexRef } = useFlattenedPiece({
    leafsTop: empty,
    leafsCenter: leafs,
    leafsBot: empty,
    groupFlat,
    centerIndices: filtered,
  });

  const pivotPiece = usePiece(pivotColumns);

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
    leafsTop: empty,
    leafs,
    leafsBot: empty,
    sorted: filtered,
    pivotPiece,
  };
}
