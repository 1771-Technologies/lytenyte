export type ColumnGroupRowItem = {
  id: string;
  start: number;
  end: number;
  occurrenceKey: string;
  isCollapsible: boolean;
};

export type ColumnGroupRow = (ColumnGroupRowItem | null)[];
export type ColumnGroupRows = ColumnGroupRow[];
export type ColumnGroupVisibility = "visible-when-open" | "visible-when-closed" | "always-visible";

export type ColumnGroupRowItemCore = ColumnGroupRowItem;
export type ColumnGroupRowCore = ColumnGroupRow;
export type ColumnGroupRowsCore = ColumnGroupRows;
export type ColumnGroupVisibilityCore = ColumnGroupVisibility;

export type ColumnGroupRowItemPro = ColumnGroupRowItem;
export type ColumnGroupRowPro = ColumnGroupRow;
export type ColumnGroupRowsPro = ColumnGroupRows;
export type ColumnGroupVisibilityPro = ColumnGroupVisibility;
