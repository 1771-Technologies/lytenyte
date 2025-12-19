import type { ColumnAbstract, RowSource } from "@1771technologies/lytenyte-shared";
import type { API } from "../../../types/types-internal";

export function getSpanFn(rs: RowSource, visibleColumns: ColumnAbstract[], span: "row" | "col", api: API) {
  if (visibleColumns.every((c) => !(span === "col" ? (c as any).colSpan : (c as any).rowSpan))) return null;

  return (r: number, c: number) => {
    const row = rs.rowByIndex(r)?.get();
    const column = visibleColumns[c];
    if (!row || !column) return 1;

    const spanFn = span === "col" ? (column as any).colSpan : (column as any).rowSpan;

    if (!spanFn) return 1;
    if (typeof spanFn === "number") {
      if (span === "col") {
        return spanFn;
      } else {
        return r % spanFn === 0 ? spanFn : 1;
      }
    }

    return spanFn({ rowIndex: r, colIndex: c, column: column as any, row, api });
  };
}
