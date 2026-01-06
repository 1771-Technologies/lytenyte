import { get, type RowNode } from "@1771technologies/lytenyte-shared";
import type { Field } from "../../../../types";

export function computeField<K = unknown>(field: Field<any> | "__ln_group__", row: RowNode<any>): K {
  if (field === "__ln_group__" && row.kind === "branch") return row.key as K;

  if (row.kind === "branch" || row.kind === "aggregated") {
    if (typeof field === "function") return field({ row }) as K;
    if (!row.data) return null as K;
    return row.data[field as string] as K;
  }

  if (typeof field === "function") return field({ row }) as K;
  else if (!row.data) return null as K;
  else if (typeof field === "object") return get(row.data, (field as { path: string }).path) as K;

  return (row.data as any)[field] as unknown as K;
}
