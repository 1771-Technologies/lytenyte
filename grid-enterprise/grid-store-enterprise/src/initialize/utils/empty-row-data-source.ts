import type { PropsEnterprise } from "@1771technologies/grid-types";

export const emptyRowDataSource: Required<PropsEnterprise<any, any>>["rowDataSource"] = {
  rowBottomCount: () => 0,
  rowTopCount: () => 0,
  rowCount: () => 0,

  rowById: () => null,
  rowByIndex: () => null,
  rowGetMany: () => ({}),
  clean: () => {},
  init: () => {},

  columnInFilterItems: () => [],
  columnPivotGetDefinitions: () => [],
  paginateGetCount: () => 0,
  paginateRowStartAndEndForPage: () => [0, 0],
  rowChildCount: () => 0,
  rowDepth: () => 0,
  rowGroupToggle: () => {},
  rowParentIndex: () => null,
  rowReload: () => {},
  rowReplaceBottomData: () => {},
  rowReplaceData: () => {},
  rowReplaceTopData: () => {},
  rowRetryExpansion: () => {},
  rowRetryFailed: () => {},

  rowSelectionAllRowsSelected: () => false,
  rowSelectionSelectAll: () => {},
  rowSelectionClear: () => {},
  rowSelectionDeselect: () => {},
  rowSelectionGetSelected: () => [],
  rowSelectionIsIndeterminate: () => false,
  rowSelectionIsSelected: () => false,
  rowSelectionSelect: () => {},
  rowSetData: () => {},
  rowSetDataMany: () => {},
};
