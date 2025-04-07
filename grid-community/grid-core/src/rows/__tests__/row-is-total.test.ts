import { ROW_GROUP_KIND, ROW_TOTAL_KIND } from "@1771technologies/grid-constants";
import { rowIsTotal } from "../row-is-total.js";
import type { RowNodePro } from "@1771technologies/grid-types/pro";

test("returns the correct type predicate value", () => {
  expect(rowIsTotal({ kind: ROW_TOTAL_KIND } as RowNodePro<any>)).toEqual(true);
  expect(rowIsTotal({ kind: ROW_GROUP_KIND } as RowNodePro<any>)).toEqual(false);
});
