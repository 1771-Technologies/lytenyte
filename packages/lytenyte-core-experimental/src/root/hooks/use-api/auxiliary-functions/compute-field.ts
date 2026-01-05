import { get, type RowNode } from "@1771technologies/lytenyte-shared";
import type { Field } from "../../../../types";

export function computeField<T>(field: Field<T> | "__ln_group__", row: RowNode<T>) {
  if (field === "__ln_group__" && row.kind === "branch") return row.key;

  if (row.kind === "branch" || row.kind === "aggregated") {
    if (typeof field === "function") return field({ row });
    if (!row.data) return null;
    return row.data[field as string];
  }

  if (typeof field === "function") return field({ row });
  else if (!row.data) return null;
  else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

  return (row.data as any)[field] as unknown;
}
