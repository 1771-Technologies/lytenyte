import type { RowNodeLeaf, Writable } from "@1771technologies/grid-types/core";
import type { ClientState } from "../create-client-data-source";

export function rowSetDataMany<D, E>(state: ClientState<D, E>, updates: Record<string, D>) {
  const rowIds = Object.keys(updates);
  const graph = state.graph.peek();
  const api = state.api.peek();

  const rows = rowIds.map((id) => {
    const row = graph.rowById(id);
    if (!row || !api.rowIsLeaf(row)) {
      throw new Error(
        `Attempting to update the data in the row ${id}, but it either was not found or is not a leaf node.`,
      );
    }

    return row as Writable<RowNodeLeaf<D>>;
  });

  for (const row of rows) {
    row.data = updates[row.id];
  }

  state.cache.set({});
  state.rowTopNodes.set((prev) => [...prev]);
  state.rowBottomNodes.set((prev) => [...prev]);
  state.rowTopNodes.set((prev) => [...prev]);

  api.rowRefresh();
}
