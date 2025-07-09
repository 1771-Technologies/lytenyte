import type { Column, RowColTuple, SpanLayout } from "./+types.non-gen";

export const DEFAULT_COLUMN_WIDTH = 200;
export const DEFAULT_COLUMN_WIDTH_MAX = 1000;
export const DEFAULT_COLUMN_WIDTH_MIN = 80;

export const ROW_OVERSCAN_START = 2;
export const ROW_OVERSCAN_END = 4;
export const COL_OVERSCAN = 1;

export const FULL_WIDTH_MAP = new Map<Column, RowColTuple>();
export const NORMAL_CELL: RowColTuple = [1, 1];
export const DEFAULT_PREVIOUS_LAYOUT: SpanLayout = {
  colCenterEnd: 0,
  colCenterLast: 0,
  colCenterStart: 0,
  colEndEnd: 0,
  colEndStart: 0,
  colStartEnd: 0,
  colStartStart: 0,
  rowBotEnd: 0,
  rowBotStart: 0,
  rowCenterEnd: 0,
  rowCenterLast: 0,
  rowCenterStart: 0,
  rowTopEnd: 0,
  rowTopStart: 0,
};

export const GROUP_COLUMN_PREFIX = "lytenyte-group-column:";
export const GROUP_COLUMN_MULTI_PREFIX = `${GROUP_COLUMN_PREFIX}:multi:`;
export const GROUP_COLUMN_SINGLE_ID = `${GROUP_COLUMN_PREFIX}:single`;
export const GROUP_COLUMN_TREE_DATA = `${GROUP_COLUMN_PREFIX}:tree`;
