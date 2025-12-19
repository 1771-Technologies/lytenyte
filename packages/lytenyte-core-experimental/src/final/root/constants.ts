import type { RowSource } from "../types/row-source";

export const EMPTY_POSITION_ARRAY = new Uint32Array();
export const AnyArray = Object.freeze([]) as any;
export const AnyObject = Object.freeze({}) as any;
export const AnySet = Object.freeze(new Set<any>());

export const DEFAULT_ROW_SOURCE: RowSource = {
  useBottomCount: () => 0,
  useTopCount: () => 0,
  useRowCount: () => 0,
  useMaxRowGroupDepth: () => 0,
  useSnapshotVersion: () => 1,

  rowIndexToRowId: () => null,
  rowByIndex: () => ({ get: () => null, useValue: () => null }),
};
