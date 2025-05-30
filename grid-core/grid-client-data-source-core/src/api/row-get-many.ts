import { rowByIndex } from "./row-by-index";
import type { ClientState } from "../create-client-data-source";
import type { RowNodeCore } from "@1771technologies/grid-types/core";

export function rowGetMany<D, E>(state: ClientState<D, E>, start: number, end: number) {
  const rows: RowNodeCore<D>[] = [];
  for (let i = start; i < end; i++) {
    const row = rowByIndex(state, i);
    if (row) rows.push(row);
  }

  return rows;
}
