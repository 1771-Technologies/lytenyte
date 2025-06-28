import { get } from "@1771technologies/lytenyte-js-utils";
import type { FieldFn, Grid, GridApi } from "../../+types";

export const makeFieldForColumn = (grid: Grid<any>): GridApi<any>["fieldForColumn"] => {
  return (c, data) => {
    const meta = grid.state.columnMeta.get();
    const column = typeof c === "string" ? meta.columnLookup.get(c) : c;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined: ${c}`);
      return null;
    }

    const field = column.field ?? column.id;

    const fieldType = typeof field;
    if (fieldType === "string" || fieldType === "number") return data[field as any] as unknown;
    if (fieldType === "object") return get(data, (field as { path: string }).path);

    return (field as FieldFn<any>)({ column, data, grid });
  };
};
