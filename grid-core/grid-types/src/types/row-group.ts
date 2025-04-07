export type RowGroupDisplayMode = "single-column" | "multi-column" | "custom";
export type RowGroupExpansions = { [rowId: string]: boolean | undefined };

export type RowGroupDisplayModeCore = RowGroupDisplayMode;
export type RowGroupExpansionsCore = RowGroupExpansions;

export type RowGroupDisplayModePro = RowGroupDisplayMode;
export type RowGroupExpansionsPro = RowGroupExpansions;
