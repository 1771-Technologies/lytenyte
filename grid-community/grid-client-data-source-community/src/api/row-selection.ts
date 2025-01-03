import type { RowNode } from "@1771technologies/grid-types/community";
import type { ClientState } from "../create-client-data-source";
import { rowById } from "./row-by-id";

export function rowSelection<D, E>(state: ClientState<D, E>) {
  return {
    rowSelectionSelectAllSupported: () => true,
    rowSelectionSelectAll: () => {
      const graph = state.graph.peek();
      const allRows = graph.rowGetAllRows();

      const rowIds = allRows.map((c) => c.id);

      state.selectedIds.set(new Set(rowIds));
    },
    rowSelectionAllRowsSelected: () => {
      const graph = state.graph.peek();

      const allRows = graph.rowGetAllRows();
      const rowIds = new Set(allRows.map((c) => c.id));

      return rowIds.isSubsetOf(state.selectedIds.peek());
    },
    rowSelectionClear: () => {
      state.selectedIds.set(new Set());
      state.api.peek().rowRefresh();
    },
    rowSelectionDeselect: (ids: string[]) => {
      const selectedIds = state.selectedIds.peek();
      for (let i = 0; i < ids.length; i++) selectedIds.delete(ids[i]);

      state.api.peek().rowRefresh();
    },
    rowSelectionSelect: (ids: string[]) => {
      const selectedIds = state.selectedIds.peek();
      for (let i = 0; i < ids.length; i++) selectedIds.add(ids[i]);

      state.api.peek().rowRefresh();
    },
    rowSelectionGetSelected: () => {
      const selected = state.selectedIds.peek();

      const nodes: RowNode<D>[] = [];
      for (const id of selected) {
        const row = rowById(state, id);
        if (!row) continue;
        nodes.push(row);
      }

      return nodes.map((c) => c.id);
    },
    rowSelectionIsIndeterminate: (id: string) => {
      const graph = state.graph.peek();
      const row = graph.rowById(id);
      if (!row) return false;
      const index = graph.rowIdToRowIndex(row.id);
      if (index == null) return false;

      const allChildren = graph.rowAllChildren(index);

      const selectedIds = state.selectedIds.peek();

      // Not every id is select but some are selected. Note we cannot simply compare set sizes
      // since the select ids may have ids of rows that have since been removed.
      return (
        !allChildren.every((c) => selectedIds.has(c.id)) &&
        allChildren.some((c) => selectedIds.has(c.id))
      );
    },
    rowSelectionIsSelected: (id: string) => state.selectedIds.peek().has(id),
  };
}
