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

      const sx = state.api.peek().getState();

      sx.rowSelectionSelectedIds.set(new Set(rowIds));
    },
    rowSelectionAllRowsSelected: () => {
      const graph = state.graph.peek();

      const allRows = graph.rowGetAllRows();
      const rowIds = new Set(allRows.map((c) => c.id));

      const sx = state.api.peek().getState();
      const current = sx.rowSelectionSelectedIds.peek();
      return rowIds.isSubsetOf(current);
    },
    rowSelectionClear: () => {
      const sx = state.api.peek().getState();

      sx.rowSelectionSelectedIds.set(new Set());
    },
    rowSelectionDeselect: (ids: string[], childrenAsWell = false) => {
      const sx = state.api.peek().getState();
      const selectedIds = sx.rowSelectionSelectedIds.peek();

      const next = new Set(selectedIds);

      const graph = state.graph.peek();
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const rowIndex = graph.rowIdToRowIndex(id);
        if (rowIndex == null) {
          next.delete(id);
          continue;
        }

        next.delete(id);
        if (childrenAsWell) {
          const children = graph.rowAllChildren(rowIndex);

          for (let i = 0; i < children.length; i++) next.delete(children[i].id);
        }
      }

      sx.rowSelectionSelectedIds.set(next);
    },
    rowSelectionSelect: (ids: string[], childrenAsWell = false) => {
      const sx = state.api.peek().getState();
      const selectedIds = sx.rowSelectionSelectedIds.peek();
      const graph = state.graph.peek();

      const next = new Set(selectedIds);
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const rowIndex = graph.rowIdToRowIndex(id);
        if (rowIndex == null) continue;

        next.add(id);

        if (childrenAsWell) {
          const children = graph.rowAllChildren(rowIndex);

          for (let i = 0; i < children.length; i++) next.add(children[i].id);
        }
      }

      sx.rowSelectionSelectedIds.set(next);
    },
    rowSelectionGetSelected: () => {
      const selected = state.api.peek().getState().rowSelectionSelectedIds.peek();

      const nodes: RowNode<D>[] = [];
      for (const id of selected) {
        const row = rowById(state, id);
        if (!row) continue;
        nodes.push(row);
      }

      return nodes;
    },
    rowSelectionIsIndeterminate: (id: string) => {
      const graph = state.graph.peek();
      const row = graph.rowById(id);
      if (!row) return false;
      const index = graph.rowIdToRowIndex(row.id);
      if (index == null) return false;

      const allChildren = graph.rowAllChildren(index);

      const sx = state.api.peek().getState();
      const selectedIds = sx.rowSelectionSelectedIds.peek();

      // Not every id is select but some are selected. Note we cannot simply compare set sizes
      // since the select ids may have ids of rows that have since been removed.
      return (
        !allChildren.every((c) => selectedIds.has(c.id)) &&
        allChildren.some((c) => selectedIds.has(c.id))
      );
    },
    rowSelectionIsSelected: (id: string) =>
      state.api.peek().getState().rowSelectionSelectedIds.peek().has(id),
  };
}
