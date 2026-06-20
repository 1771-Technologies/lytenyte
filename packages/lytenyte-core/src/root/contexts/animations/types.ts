import type { RowPin } from "@1771technologies/lytenyte-shared";

export interface PositionEntry {
  readonly y: number;
  readonly pin: RowPin;
}

export interface RowMoved {
  readonly id: string;
  readonly from: number;
  readonly to: number;
}

export interface RowAddedOrRemoved {
  readonly id: string;
  readonly pin: RowPin;
}

export interface RowChanges {
  readonly moved: RowMoved[];
  readonly removed: RowAddedOrRemoved[];
  readonly added: RowAddedOrRemoved[];
}

export const EMPTY_ROW_CHANGES: RowChanges = { moved: [], removed: [], added: [] };
