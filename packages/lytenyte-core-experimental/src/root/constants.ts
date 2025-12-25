import type { RowSource } from "@1771technologies/lytenyte-shared";

export const EMPTY_POSITION_ARRAY = new Uint32Array();
export const AnyArray = Object.freeze([]) as any;
export const AnyObject = Object.freeze({}) as any;
export const AnySet = Object.freeze(new Set<any>());

export const DEFAULT_ROW_SOURCE: RowSource = {
  useBottomCount: () => 0,
  useTopCount: () => 0,
  useRowCount: () => 0,
  useSnapshotVersion: () => 1,
  useMaxRowGroupDepth: () => 0,

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

  onRowGroupExpansionChange: () => {},
  onRowsUpdated: () => {},
  onRowsSelected: () => {},
  onViewChange: () => {},
};
