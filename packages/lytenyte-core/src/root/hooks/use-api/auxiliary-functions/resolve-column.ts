import { GROUP_COLUMN_PREFIX, type ColumnAbstract, type ColumnView } from "@1771technologies/lytenyte-shared";

export function resolveColumn(
  c: string | number | ColumnAbstract,
  errorRef: { current: boolean },
  view: ColumnView,
) {
  if (typeof c === "string") {
    if (c.startsWith(GROUP_COLUMN_PREFIX)) {
      return view.visibleColumns.find((x) => x.id === c);
    }
    if (!view.lookup.has(c)) {
      errorRef.current = true;
      console.error(`Invalid column ${c}`);
    }
    return c;
  }
  if (typeof c === "number") {
    const col = view.visibleColumns.at(c);
    if (!col) {
      errorRef.current = true;
      console.error(`Invalid column at index ${c}`);
    }
    return col?.id;
  }

  if (c.id.startsWith(GROUP_COLUMN_PREFIX)) {
    return view.visibleColumns.find((x) => x.id === c.id);
  }

  if (!view.lookup.has(c.id)) {
    errorRef.current = true;
    console.error(`Invalid column ${c.id}`);
  }
  return c.id;
}
