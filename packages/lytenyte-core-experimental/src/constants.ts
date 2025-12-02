import type { RowSource } from "./types/row";

export const EMPTY_POSITION_ARRAY = new Uint32Array();
export const AnyArray = Object.freeze([]) as any;
export const AnyObject = Object.freeze({}) as any;

export const DEFAULT_ROW_SOURCE: RowSource = {
  useBottomCount: () => 0,
  useTopCount: () => 0,
  useRowCount: () => 0,
  useSnapshotVersion: () => 1,

  rowIndexToRowId: () => null,
};
