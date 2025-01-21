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
    },
    rowSelectionDeselect: (id: string[], childrenAsWell?: boolean) => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionDeselect(id, childrenAsWell);
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
    },
    rowSelectionClear: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      backing.rowSelectionClear();
    },
    rowSelectionSelectAllSupported: () => {
      const sx = api.getState();
      const backing = sx.internal.rowBackingDataSource.peek();

      return backing.rowSelectionSelectAllSupported();
    },
  };
};
