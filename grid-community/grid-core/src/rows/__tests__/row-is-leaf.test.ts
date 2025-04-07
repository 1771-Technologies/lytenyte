import { ROW_GROUP_KIND, ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import { rowIsLeaf } from "../row-is-leaf.js";
import type { RowNodePro } from "@1771technologies/grid-types/pro";

test("returns the correct type predicate value", () => {
  expect(rowIsLeaf({ kind: ROW_LEAF_KIND } as RowNodePro<any>)).toEqual(true);
  expect(rowIsLeaf({ kind: ROW_GROUP_KIND } as RowNodePro<any>)).toEqual(false);
});
