import { ROW_TOTAL_ID, ROW_TOTAL_KIND } from "@1771technologies/grid-constants";
import type { RowNodeTotal } from "@1771technologies/grid-types/community";

export const EMPTY_TOTAL: RowNodeTotal = {
  id: ROW_TOTAL_ID,
  data: {},
  kind: ROW_TOTAL_KIND,
  rowIndex: null,
  rowPin: null,
};
