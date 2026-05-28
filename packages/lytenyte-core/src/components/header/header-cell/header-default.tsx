import type { Grid } from "../../../index.js";

export function DefaultRenderer(p: Grid.T.HeaderParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}
