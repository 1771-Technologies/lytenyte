import type { RowNode } from "@1771technologies/lytenyte-shared";
import { dragData } from "./global.js";
import type { Root } from "../root/root.js";

type Source = { id: string; api: Root.API; row: RowNode<any>; rowIndex: number; data?: any };
export function getDragData() {
  const data = dragData();
  const source = data?.["grid:source"];
  return (source?.data ?? null) as Source;
}
