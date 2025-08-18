import type { RowDataSource } from "../../+types";

export const emptyRowDataSource: RowDataSource<any> = {
  init: () => {},
  rowById: () => null,
  rowByIndex: () => null,
  rowExpand: () => {},
  rowUpdate: () => {},
  rowToIndex: () => null,
  rowAllChildIds: () => [],
  rowSelect: () => {},
  rowSelectAll: () => {},
  rowAdd: () => {},
  rowDelete: () => {},
  rowSetBotData: () => {},
  rowSetCenterData: () => {},
  rowSetTopData: () => {},
  rowAreAllSelected: () => false,
  inFilterItems: () => [],
};
