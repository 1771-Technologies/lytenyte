import type { Ln } from "../../types";
import type { RowSource } from "../../types/row";

export function getSpanFn<T>(
  rs: RowSource<T>,
  visibleColumns: Ln.LnColumn<T>[],
  span: "row" | "col",
  api: Ln.API<T>,
) {
  if (visibleColumns.every((c) => !(span === "col" ? c.colSpan : c.rowSpan))) return null;

  return (r: number, c: number) => {
    const row = rs.rowByIndex(r)?.get();
    const column = visibleColumns[c];
    if (!row || !column) return 1;

    const spanFn = span === "col" ? column.colSpan : column.rowSpan;

    if (!spanFn) return 1;
    if (typeof spanFn === "number") {
      if (span === "col") {
        return spanFn;
      } else {
        return r % spanFn === 0 ? spanFn : 1;
      }
    }

    return spanFn({ rowIndex: r, colIndex: c, column, row, api });
  };
}
