import type { RowNode } from "@1771technologies/lytenyte-shared";
import type { API } from "../types/types-internal.js";
import { dragData } from "./global.js";

type Source = { id: string; api: API; row: RowNode<any>; rowIndex: number; data?: any };
export function getDragData() {
  const data = dragData();
  const source = data?.["grid:source"];
  return (source?.data ?? null) as Source;
}
