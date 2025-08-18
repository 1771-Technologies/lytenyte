import { GROUP_COLUMN_PREFIX } from "@1771technologies/lytenyte-shared";
import type { Column, ColumnMeta } from "../../+types";

export function resolveColumn(
  c: string | number | Column<any>,
  errorRef: { current: boolean },
  meta: ColumnMeta<any>,
) {
  if (typeof c === "string") {
    if (c.startsWith(GROUP_COLUMN_PREFIX)) {
      return meta.columnsVisible.find((x) => x.id === c);
    }
    if (!meta.columnLookup.has(c)) {
      errorRef.current = true;
      console.error(`Invalid column ${c}`);
    }
    return c;
  }
  if (typeof c === "number") {
    const col = meta.columnsVisible.at(c);
    if (!col) {
      errorRef.current = true;
      console.error(`Invalid column at index ${c}`);
    }
    return col?.id;
  }

  if (c.id.startsWith(GROUP_COLUMN_PREFIX)) {
    return meta.columnsVisible.find((x) => x.id === c.id);
  }

  if (!meta.columnLookup.has(c.id)) {
    errorRef.current = true;
    console.error(`Invalid column ${c.id}`);
  }
  return c.id;
}
