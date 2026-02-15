import { useMemo, useRef } from "react";
import type { PivotModel } from "../../use-client-data-source";
import type { Column, GridSpec } from "../../../types/index.js";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";
import {
  equal,
  type ColumnPin,
  type RowLeaf,
  itemsWithIdToMap,
  measureText,
} from "@1771technologies/lytenyte-shared";
import { pivotPaths } from "./auxiliary-functions/pivot-paths.js";
import { applyReferenceColumn } from "./auxiliary-functions/apply-reference-column.js";
import type { ControlledPivotState } from "./use-pivot-state";

export interface PivotState {
  readonly columnState: {
    readonly ordering: string[];
    readonly resizing: Record<string, number>;
    readonly pinning: Record<string, ColumnPin>;
  };
  readonly columnGroupState: Record<string, boolean>;
  readonly rowGroupExpansions: Record<string, boolean | undefined>;
}

export function usePivotColumns<Spec extends GridSpec = GridSpec>(
  pivotMode: boolean,
  pivotControlled: ControlledPivotState,
  model: PivotModel<Spec> | undefined,
  leafs: RowLeaf<Spec["data"]>[],
  filtered: number[],
  processor: null | undefined | ((columns: Column<any>[]) => Column<any>[]),
) {
  const measures = model?.measures;
  const columns = model?.columns;

  const prevMeasuresRef = useRef(measures);
  const prevColumnsRef = useRef(columns);

  const pivotColumns = useMemo<Column<Spec>[] | null>(() => {
    if (!pivotMode) return null;

    // At this point we should check if we need to replace the pivot state
    const prevMeasures = prevMeasuresRef.current;
    const prevColumns = prevColumnsRef.current;

    // If the measures or columns have changed, then the pivot state should be reset.
    if (!equal(prevMeasures, measures) || !equal(prevColumns, columns)) {
      pivotControlled.setState((prev) => ({
        ...prev,
        columnState: { ordering: [], pinning: {}, resizing: {} },
        columnGroupState: {},
      }));

      prevColumnsRef.current = columns;
      prevMeasuresRef.current = measures;
    }

    if (!measures?.length && !columns?.length) return [];

    // There are only measures, hence each measure should become a column.
    if (!columns?.length) {
      return measures!.map<Column<Spec>>((x) => {
        const column: Column<Spec> = applyReferenceColumn(
          {
            id: x.dim.id,
            field: x.dim.id,
            name: x.dim.name,
          },
          x.dim as any,
        );
        return column;
      });
    }

    const paths = pivotPaths(filtered, leafs, columns, measures, model?.colLabelFilter);

    const lookup = Object.fromEntries((measures ?? []).map((x) => [x.dim.id, x]));
    const cols = paths.map((path) => {
      const partsRaw = path.split("-->");
      const parts = partsRaw.map((x) => (x === "ln__blank__" ? "(blank)" : x));

      if (parts.length === 1) {
        return { id: path };
      }

      const measureId = parts.at(-1)!;
      const measureRef = lookup[measureId]?.dim as Omit<Column<Spec>, "id">;

      // Pop the last part as this is the aggregation value
      parts.pop();

      let name = measureId === "ln__noop" || measures?.length === 1 ? parts.at(-1)! : measureId;

      if (name === "ln__grand_total") name = "Grand Total";
      if (parts[0] === "ln__grand_total" && measures && measures.length! > 1)
        name = "Grand Total " + measureId;
      if (name === "ln__total") name = "Total";

      const group = (
        parts.length === 1 && measures?.length === 1
          ? undefined
          : !measures?.length || measures.length === 1
            ? parts.slice(0, -1)
            : parts
      )?.map((x) => (x === "ln__total" ? "Total" : x));

      partsRaw.pop();

      const label = measures!.length > 1 ? (measureRef?.name ?? name) : name;

      const minWidth = measureText(label);

      const column: Column<Spec> = applyReferenceColumn(
        {
          id: path,
          name: label,
          widthMin: minWidth?.width,
          groupPath: group?.map((x) => {
            if (x === "ln__grand_total") return "Grand Total";
            if (x === "ln__total") return "Total";

            return x;
          }),
          groupVisibility: path.includes("ln__total") || path.includes("ln__grand_total") ? "always" : "open",
          field: ({ row }) => {
            // If the value is a group then we can simply grab the aggregated value.
            if (row.kind === "branch" || row.kind === "aggregated") return row.data[path];

            // Pivots do not have leafs displayed. So here we do something interesting. We return true if the
            // row should be kept for this pivot, otherwise false. This is effectively a leaf row filter for pivots.
            // We can then aggregate these.
            for (let i = 0; i < columns.length; i++) {
              const c = columns[i];
              const field = c.field ?? (c as any).id;
              const value = field ? computeField(field, row) : false;
              const match = partsRaw[i];

              // This is a total columns. Totals will always be one shorter than than the path
              if (i >= partsRaw.length) return true;

              const isMatch =
                match.startsWith("ln") ||
                String(value) === match ||
                (value == null && match === "ln__blank__");
              if (!isMatch) return false;
            }

            return true;
          },
        },
        measureRef,
      );

      return column;
    });

    return cols;
  }, [pivotMode, measures, columns, filtered, leafs, model?.colLabelFilter, pivotControlled]);

  const pivotColumnsWithState = useMemo(() => {
    if (!pivotColumns) return null;

    const state = pivotControlled.pivotColumnState;
    const byId = itemsWithIdToMap(pivotColumns);
    const ordering = state.ordering.filter((x) => byId.has(x));

    const withBlanks = pivotColumns.map((x) => (ordering.includes(x.id) ? null : x));
    let orderPos = 0;
    for (let i = 0; i < withBlanks.length; i++) {
      if (withBlanks[i]) continue;

      const id = state.ordering[orderPos];
      const column = byId.get(id)!;
      withBlanks[i] = column;
      orderPos++;
    }
    Object.entries(state.resizing).forEach(([id, value]) => {
      const column = byId.get(id);
      if (!column) return;
      Object.assign(column, { width: value });
    });
    Object.entries(state.pinning).forEach(([id, value]) => {
      const column = byId.get(id);
      if (!column) return;
      Object.assign(column, { pin: value });
    });

    return withBlanks as Column<Spec>[];
  }, [pivotColumns, pivotControlled.pivotColumnState]);

  const processedColumns = useMemo(() => {
    if (!processor || !pivotColumnsWithState) return pivotColumnsWithState;

    return processor(pivotColumnsWithState) as Column<Spec>[];
  }, [pivotColumnsWithState, processor]);

  return processedColumns;
}
