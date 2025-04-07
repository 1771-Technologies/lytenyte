import { ROW_TOTAL_ID, ROW_TOTAL_KIND } from "@1771technologies/grid-constants";
import type { RowNodeTotalCore } from "@1771technologies/grid-types/core";

export const EMPTY_TOTAL: RowNodeTotalCore = {
  id: ROW_TOTAL_ID,
  data: {},
  kind: ROW_TOTAL_KIND,
  rowIndex: null,
  rowPin: null,
};
