import type { Column, ColumnMeta } from "../../+types";

export function resolveColumn(
  c: string | number | Column<any>,
  errorRef: { current: boolean },
  meta: ColumnMeta<any>,
) {
  if (typeof c === "string") {
    if (!meta.columnLookup.has(c)) {
      errorRef.current = true;
      console.error(`Attempt to move invalid column ${c}`);
    }
    return c;
  }
  if (typeof c === "number") {
    const col = meta.columnsVisible.at(c);
    if (!col) {
      errorRef.current = true;
      console.error(`Attempt to move invalid column at index ${c}`);
    }
    return col?.id;
  }

  if (!meta.columnLookup.has(c.id)) {
    errorRef.current = true;
    console.error(`Attempt to move invalid column ${c.id}`);
  }
  return c.id;
}
