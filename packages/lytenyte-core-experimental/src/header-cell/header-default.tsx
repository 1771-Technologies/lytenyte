import type { HeaderParams } from "../types/column.js";

export function DefaultRenderer(p: HeaderParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}
