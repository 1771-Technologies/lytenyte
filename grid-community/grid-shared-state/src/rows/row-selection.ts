import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const rowSelection = <D, E>(api: ApiEnterprise<D, E> | ApiCommunity<D, E>) => {
  return {
    rowSelectionGetSelected: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionGetSelected();
    },
    rowSelectionSelect: (id: string[], childrenAsWell?: boolean) => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionSelect(id, childrenAsWell);

      (api as ApiCommunity<D, E>).eventFire("onRowSelectionSelected", {
        api: api as any,
        rows: id.map((c) => api.rowById(c)).filter((c) => !!c),
      });
    },
    rowSelectionDeselect: (id: string[], childrenAsWell?: boolean) => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionDeselect(id, childrenAsWell);

      (api as ApiCommunity<D, E>).eventFire("onRowSelectionDeselected", {
        api: api as any,
        rows: id.map((c) => api.rowById(c)).filter((c) => !!c),
      });
    },
    rowSelectionIsIndeterminate: (id: string) => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionIsIndeterminate(id);
    },
    rowSelectionAllRowsSelected: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionAllRowsSelected();
    },
    rowSelectionSelectAll: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionSelectAll();

      (api as ApiCommunity<D, E>).eventFire("onRowSelectionAllSelected", api as any);
    },
    rowSelectionClear: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionClear();

      (api as ApiCommunity<D, E>).eventFire("onRowSelectionClear", api as any);
    },
    rowSelectionSelectAllSupported: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionSelectAllSupported();
    },
  };
};
