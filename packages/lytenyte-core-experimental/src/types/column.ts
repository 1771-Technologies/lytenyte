import type { Ln } from "../types";

export type ColumnPin = "start" | "end" | null;
export type ColumnGroupVisibility = "always" | "close" | "open";

export interface ColumnMeta<T> {
  readonly columnsVisible: Ln.LnColumn<T>[];
  readonly columnLookup: Map<string, Ln.LnColumn<T>>;
  readonly columnVisibleStartCount: number;
  readonly columnVisibleCenterCount: number;
  readonly columnVisibleEndCount: number;
}

export interface ColumnGroupMeta {
  readonly colIdToGroupIds: Map<string, string[]>;
  readonly validGroupIds: Set<string>;
  readonly groupIsCollapsible: Map<string, boolean>;
}

export type PathField = { kind: "path"; path: string };
