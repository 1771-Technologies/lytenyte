import { rowByIndex } from "./row-by-index";
import type { ClientState } from "../create-tree-data-source";
import type { RowNodePro } from "@1771technologies/grid-types/pro";

export function rowGetMany<D, E>(
  state: ClientState<D, E>,
  start: number,
  end: number,
): RowNodePro<D>[] {
  const rows: RowNodePro<D>[] = [];
  for (let i = start; i < end; i++) {
    const row = rowByIndex(state, i);
    if (row) rows.push(row);
  }

  return rows;
}
