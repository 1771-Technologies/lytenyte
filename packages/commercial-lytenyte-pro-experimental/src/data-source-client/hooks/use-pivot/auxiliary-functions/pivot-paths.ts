import type { RowLeaf } from "@1771technologies/lytenyte-shared";
import type { PivotModel } from "../../../use-client-data-source";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";
import { pivotPathsWithTotals } from "./pivot-paths-with-totals.js";
import type { GridSpec } from "@1771technologies/lytenyte-core-experimental/types";

export function pivotPaths<Spec extends GridSpec>(
  filtered: number[],
  leafs: RowLeaf<Spec["data"]>[],
  columns: Required<PivotModel<Spec>>["columns"],
  measures: PivotModel<Spec>["measures"],
) {
  const pathSet = new Set<string>();
  for (let i = 0; i < filtered.length; i++) {
    const row = leafs[filtered[i]];
    const current: string[] = [];
    for (const c of columns) {
      const field = c.field ?? (c as any).id;
      const value = field ? computeField(field, row) : null;

      const pivotKey = value == null ? "ln__blank__" : String(value);
      current.push(pivotKey as string);
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

  return pathsWithTotals;
}
