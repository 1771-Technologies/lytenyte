import type { ClientState } from "../create-client-data-source";

export function rowSelection<D, E>(state: ClientState<D, E>) {
  return {
    rowSelectionSelectAll: () => {},
    rowSelectionAllRowsSelected: () => false,
    rowSelectionClear: () => {},
    rowSelectionDeselect: () => {},
    rowSelectionSelect: () => {},
    rowSelectionGetSelected: () => [],
    rowSelectionIsIndeterminate: (id: string) => {
      const graph = state.graph.peek();
      const row = graph.rowById(id);

      if (!row) return false;
    },
    rowSelectionIsSelected: (id: string) => state.selectedIds.peek().has(id),
  };
}
