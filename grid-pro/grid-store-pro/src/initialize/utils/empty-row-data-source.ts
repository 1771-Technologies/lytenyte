import type { GridPro } from "@1771technologies/grid-types/pro";

export const emptyRowDataSource: ReturnType<
  Required<GridPro<any, any>>["state"]["rowDataSource"]["get"]
> = {
  rowBottomCount: () => 0,
  rowTopCount: () => 0,
  rowCount: () => 0,

  rowById: () => null,
  rowByIndex: () => null,
  rowGetMany: () => ({}),
  clean: () => {},
  init: () => {},

  columnInFilterItems: () => [],
  columnPivots: () => [],
  paginateGetCount: () => 0,
  paginateRowStartAndEndForPage: () => [0, 0],
  rowDepth: () => 0,
  rowReload: () => {},
  rowReplaceBottomData: () => {},
  rowReplaceData: () => {},
  rowReplaceTopData: () => {},
  rowReloadExpansion: () => {},
  rowReset: () => {},

  rowGetAllChildrenIds: () => [],
  rowGetAllIds: () => [],
  rowIdToRowIndex: () => null,
  rowSelectionIndeterminateSupported: () => false,

  rowSelectionSelectAllSupported: () => false,
  rowSetData: () => {},
  rowSetDataMany: () => {},
};
