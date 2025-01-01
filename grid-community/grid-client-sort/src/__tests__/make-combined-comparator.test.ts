import { expect, test } from "@1771technologies/aio/vitest";
import { createStore } from "@1771technologies/lng-store";
import { getComparatorsForModel } from "../get-comparators-for-model";
import { makeCombinedComparator } from "../make-combined-comparator";

test("makeCombinedComparator", () => {
  const store = createStore({
    columns: [{ id: "x" }, { id: "y", type: "number" }],
    rowDataSource: {
      kind: "client",
      data: [
        { x: "A", y: 1 },
        { x: "A", y: 2 },
        { x: "A", y: 1 },
        { x: "B", y: 2 },
        { x: "b", y: 3 },
      ],
    },
    sortModel: [{ columnId: "x" }, { columnId: "y" }],
  });
  const api = store.state.api;

  const comparators = getComparatorsForModel(api, store.state.sortModel, store.state.columnLookup);

  const combined = makeCombinedComparator(api, store.state.sortModel, comparators);

  expect(combined(api.rowByIndex(0)!, api.rowByIndex(2)!)).toEqual(-1);
  expect(combined(api.rowByIndex(0)!, api.rowByIndex(1)!)).toEqual(0);

  api.setProperty("sortModel", [{ columnId: "x" }, { columnId: "y", isDescending: true }]);
  expect(combined(api.rowByIndex(0)!, api.rowByIndex(2)!)).toEqual(1);
});
