import type { RowDataSource } from "../../+types";

export const emptyRowDataSource: RowDataSource<any> = {
  init: () => {},
  rowById: () => null,
  rowByIndex: () => null,
};
