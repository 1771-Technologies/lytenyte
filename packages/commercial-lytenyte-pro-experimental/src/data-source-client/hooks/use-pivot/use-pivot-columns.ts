import { useMemo } from "react";
import type { PivotModel } from "../../use-client-data-source";
import type { Column, GridSpec } from "@1771technologies/lytenyte-core-experimental/types";
import { pivotPathsWithTotals } from "./auxiliary-functions/pivot-paths-with-totals.js";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";
import type { ColumnPin, RowLeaf } from "@1771technologies/lytenyte-shared";
import { evaluateLabelFilter } from "./auxiliary-functions/evaluate-label-filter.js";

export interface PivotState {
  readonly ordering: string[];
  readonly resizing: Record<string, number>;
  readonly pinning: Record<string, ColumnPin>;
}

export function usePivotColumns<Spec extends GridSpec = GridSpec>(
  pivotMode: boolean,
  model: PivotModel<Spec> | undefined,
  leafs: RowLeaf<Spec["data"]>[],
  filtered: number[],
  processor: null | undefined | ((columns: Column<any>[]) => Column<any>[]),
) {
  const measures = model?.measures;
  const columns = model?.columns;
  const columnLabelFilter = model?.colLabelFilter;

  // const [pivotState, setPivotState] = useState<PivotState>({ ordering: [], resizing: {}, pinning: {} });

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
      let current: string[] = [];
      for (const c of columns) {
        const field = c.field ?? (c as any).id;
        const value = field ? computeField(field, row) : null;

        const pivotKey = value == null ? null : String(value);
        current.push(pivotKey as string);
      }

      current = current.map((x) => (x == null ? "ln__blank__" : x));
      if (!evaluateLabelFilter(columnLabelFilter, current)) continue;

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
      const partsRaw = path.split("-->");
      const parts = partsRaw.map((x) => (x === "ln__blank__" ? "(blank)" : x));

      if (parts.length === 1) {
        return { id: path };
      }

      const measureId = parts.at(-1)!;
      const measureRef = (lookup[measureId]?.reference ?? {}) as Omit<Column<Spec>, "id">;

      // Pop the last part as this is the aggregation value
      parts.pop();

      let name = measureId === "ln__noop" || measures?.length === 1 ? parts.at(-1)! : measureId;
      if (name === "ln__grand_total") name = "Grand Total";
      if (parts[0] === "ln__grand_total" && measures && measures.length! > 1)
        name = "Grand Total " + measureId;
      if (name === "ln__total") name = "Total";

      const group = (
        parts.length === 1
          ? undefined
          : !measures?.length || measures.length === 1
            ? parts.slice(0, -1)
            : parts
      )?.map((x) => (x === "ln__total" ? "Total" : x));

      partsRaw.pop();
      const column: Column<Spec> = {
        id: path,
        name,
        groupPath: group,
        field: ({ row }) => {
          // If the value is a group then we can simply grab the aggregated value.
          if (row.kind === "branch") return row.data[path];

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
              match.startsWith("ln") || String(value) === match || (value == null && match === "ln__blank__");
            if (!isMatch) return false;
          }

          return true;
        },
        headerRenderer: measureRef.headerRenderer,
        cellRenderer: measureRef.cellRenderer,
        autosizeCellFn: measureRef.autosizeCellFn,
        autosizeHeaderFn: measureRef.autosizeHeaderFn,
        floatingCellRenderer: measureRef.floatingCellRenderer,
        movable: measureRef.movable,
        resizable: measureRef.resizable,
        type: measureRef.type,
        width: measureRef.width,
        widthMin: measureRef.widthMin,
        widthMax: measureRef.widthMax,
        widthFlex: measureRef.widthFlex,
      };

      return column;
    });

    return cols;
  }, [columnLabelFilter, columns, filtered, leafs, measures, pivotMode]);

  const processedColumns = useMemo(() => {
    if (!processor || !pivotColumns) return pivotColumns;

    return processor(pivotColumns);
  }, [pivotColumns, processor]);

  return processedColumns;
}
