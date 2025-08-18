import { get } from "@1771technologies/lytenyte-js-utils";
import type { FieldFn, Grid, GridApi } from "../../+types";

export const makeColumnField = (grid: Grid<any>): GridApi<any>["columnField"] => {
  return (c, d) => {
    const meta = grid.state.columnMeta.get();
    const column = typeof c === "string" ? meta.columnLookup.get(c) : c;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined: ${c}`);
      return null;
    }

    const field = column.field ?? column.id;
    if (d.kind === "branch") {
      if (typeof field === "function") return field({ column, data: d, grid });

      return d.data?.[column.id];
    }

    const fieldType = typeof field;
    if (fieldType === "string" || fieldType === "number") return d.data?.[field as any] as unknown;
    if (fieldType === "object") return get(d.data, (field as { path: string }).path);

    return (field as FieldFn<any>)({ column, data: d, grid });
  };
};
