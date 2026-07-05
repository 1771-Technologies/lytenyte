import type { ColumnPin } from "@1771technologies/lytenyte-shared";

export interface ColumnPositionEntry {
  readonly index: number;
  readonly x: number;
  readonly pin: ColumnPin;
}

export interface ColumnMoved {
  readonly id: string;
  readonly fromX: number;
  readonly toX: number;
}

export interface ColumnAddedOrRemoved {
  readonly id: string;
  readonly pin: ColumnPin;
}

export interface ColumnChanges {
  readonly moved: ColumnMoved[];
  readonly removed: ColumnAddedOrRemoved[];
  readonly added: ColumnAddedOrRemoved[];
}

export const EMPTY_COLUMN_CHANGES: ColumnChanges = { moved: [], removed: [], added: [] };
