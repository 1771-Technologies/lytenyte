import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";

export const rowSelection = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>) => {
  return {
    rowSelectionGetSelected: () => {
      const sx = api.getState();

      const selectedIds = sx.rowSelectionSelectedIds.peek();

      const nodes: RowNode<D>[] = [];
      for (const id of selectedIds) {
        const row = api.rowById(id);
        if (row) nodes.push(row);
      }

      return nodes;
    },
    rowSelectionSelect: (ids: string[], childrenAsWell?: boolean) => {
      const sx = api.getState();
      if (ids.length <= 0) return;

      const backing = sx.internal.rowBackingDataSource.peek();

      const next = new Set(sx.rowSelectionSelectedIds.peek());
      const rowIds: string[] = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const row = api.rowById(id);
        if (row == null) continue;

        next.add(row.id);
        rowIds.push(row.id);
        const rowIndex = backing.rowIdToRowIndex(row.id);

        if (childrenAsWell && api.rowIsGroup(row) && rowIndex != null) {
          const children = backing.rowGetAllChildrenIds(rowIndex);

          for (let c = 0; c < children.length; c++) next.add(children[c]);
          rowIds.push(...children);
        }
      }

      sx.rowSelectionSelectedIds.set(next);
      (api as ApiCommunity<D, E>).eventFire("onRowSelectionSelected", {
        api: api as any,
        rowIds,
      });
    },
    rowSelectionDeselect: (ids: string[], childrenAsWell?: boolean) => {
      if (ids.length <= 0) return;
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      const next = new Set(sx.rowSelectionSelectedIds.peek());

      const rowIds: string[] = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const row = api.rowById(id);
        if (row == null) {
          next.delete(id);
          continue;
        }

        next.delete(row.id);
        rowIds.push(row.id);
        const rowIndex = backing.rowIdToRowIndex(row.id);

        if (childrenAsWell && api.rowIsGroup(row) && rowIndex != null) {
          const children = backing.rowGetAllChildrenIds(rowIndex);

          for (let c = 0; c < children.length; c++) next.delete(children[c]);
          rowIds.push(...children);
        }
      }

      sx.rowSelectionSelectedIds.set(next);
      (api as ApiCommunity<D, E>).eventFire("onRowSelectionDeselected", {
        api: api as any,
        rowIds,
      });
    },
    rowSelectionIsIndeterminate: (id: string) => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      if (!backing.rowSelectionIndeterminateSupported()) return false;

      const row = api.rowById(id);
      if (!row) return false;

      const rowIndex = backing.rowIdToRowIndex(id);
      if (rowIndex == null) return false;

      const allChildren = backing.rowGetAllChildrenIds(rowIndex);
      const selectedIds = sx.rowSelectionSelectedIds.peek();

      // Not every id is select but some are selected. Note we cannot simply compare set sizes
      // since the select ids may have ids of rows that have since been removed.
      return (
        !allChildren.every((c) => selectedIds.has(c)) && allChildren.some((c) => selectedIds.has(c))
      );
    },
    rowSelectionAllRowsSelected: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();
      if (!backing.rowSelectionSelectAllSupported()) return false;

      const allIds = new Set(backing.rowGetAllIds());
      const selectedIds = sx.rowSelectionSelectedIds.peek();

      return !!allIds.size && allIds.isSubsetOf(selectedIds);
    },
    rowSelectionSelectAll: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      if (!backing.rowSelectionSelectAllSupported()) return;

      const allIds = new Set(backing.rowGetAllIds());

      sx.rowSelectionSelectedIds.set(allIds);

      (api as ApiCommunity<D, E>).eventFire("onRowSelectionAllSelected", api as any);
    },
    rowSelectionClear: () => {
      const sx = api.getState();

      sx.rowSelectionSelectedIds.set(new Set());
      (api as ApiCommunity<D, E>).eventFire("onRowSelectionClear", api as any);
    },
    rowSelectionSelectAllSupported: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionSelectAllSupported();
    },
  };
};
