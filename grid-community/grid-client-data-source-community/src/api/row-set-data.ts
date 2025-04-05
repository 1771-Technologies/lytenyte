import type { RowNode, Writable } from "@1771technologies/grid-types/core";
import type { ClientState } from "../create-client-data-source";

export function rowSetData<D, E>(
  state: ClientState<D, E>,

  rowId: string,
  data: D,
) {
  const graph = state.graph.peek();
  const api = state.api.peek();

  const row = graph.rowById(rowId) as Writable<RowNode<D>> | undefined;
  if (!row) {
    throw new Error(
      `Attempting to update the data in the row ${rowId}, but it either was not found or is not a leaf node.`,
    );
  }
  if (!api.rowIsLeaf(row)) {
    throw new Error("Only leaf rows may be updated when using the client data source.");
  }

  row.data = data;

  state.cache.set({});
  state.rowTopNodes.set((prev) => [...prev]);
  state.rowBottomNodes.set((prev) => [...prev]);
  state.rowTopNodes.set((prev) => [...prev]);

  api.rowRefresh();
}
