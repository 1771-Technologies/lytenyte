import type { Root } from "../../../root/root";

export function DefaultRenderer(p: Root.HeaderParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}
