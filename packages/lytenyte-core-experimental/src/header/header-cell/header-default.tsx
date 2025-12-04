import type { Ln } from "../../types.js";

export function DefaultRenderer(p: Ln.HeaderParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}
