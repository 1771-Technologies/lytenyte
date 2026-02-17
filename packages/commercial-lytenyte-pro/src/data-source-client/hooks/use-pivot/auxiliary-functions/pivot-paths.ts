import type { RowLeaf } from "@1771technologies/lytenyte-shared";
import type { PivotModel } from "../../../use-client-data-source";
import { computeField } from "@1771technologies/lytenyte-core/internal";
import { pivotPathsWithTotals } from "./pivot-paths-with-totals.js";
import type { GridSpec } from "../../../../types/index.js";

export function pivotPaths<Spec extends GridSpec>(
  filtered: number[],
  leafs: RowLeaf<Spec["data"]>[],
  columns: Required<PivotModel<Spec>>["columns"],
  measures: PivotModel<Spec>["measures"],
  labelFilter: PivotModel<Spec>["colLabelFilter"],
) {
  const pathSet = new Set<string>();

  for (let i = 0; i < filtered.length; i++) {
    const row = leafs[filtered[i]];
    const current: string[] = [];
    for (let j = 0; j < columns.length; j++) {
      const c = columns[j];
      const filterFn = labelFilter?.[j];

      const field = c.field ?? (c as any).id;
      const value = field ? computeField(field, row) : null;

      if (filterFn && !filterFn(value === null ? value : String(value))) continue;
      const pivotKey = value == null ? "ln__blank__" : String(value);

      current.push(pivotKey as string);
    }

    if (measures?.length) {
      for (const measure of measures) {
        pathSet.add([...current, measure.dim.id].join("-->"));
      }
    } else {
      current.push("ln__noop");
      pathSet.add(current.join("-->"));
    }
  }
  const paths = [...pathSet];

  const pathsWithTotals = pivotPathsWithTotals(paths, measures?.map((x) => x.dim.id) ?? []);

  return pathsWithTotals;
}
