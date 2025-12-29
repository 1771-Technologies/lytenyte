import type { RowSource } from "@1771technologies/lytenyte-shared";

export const EMPTY_POSITION_ARRAY = new Uint32Array();
export const AnyArray = Object.freeze([]) as any;
export const AnyObject = Object.freeze({}) as any;
export const AnySet = Object.freeze(new Set<any>());

export const DEFAULT_ROW_SOURCE: RowSource = {
  useBottomCount: () => 0,
  useTopCount: () => 0,
  useRowCount: () => 0,
  useRows: () => ({ get: () => null, size: 0 }),
  useMaxRowGroupDepth: () => 0,
  rowsSelected: () => ({ rows: [], state: { kind: "isolated", selected: false, exceptions: new Set() } }),
  rowIndexToRowId: () => null,
  rowByIndex: () => ({ get: () => null, useValue: () => null }),
  rowById: () => null,
  rowChildren: () => [],
  rowIdToRowIndex: () => null,
  rowInvalidate: () => {},
  rowIsSelected: () => false,
  rowLeafs: () => [],
  rowParents: () => [],
  rowsBetween: () => [],
  rowSelectionState: () => null as any,

  onRowGroupExpansionChange: () => {},
  onRowsUpdated: () => {},
  onRowsSelected: () => {},
  onViewChange: () => {},
};
