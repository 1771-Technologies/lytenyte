import { expect, test } from "@1771technologies/aio/vitest";
import { createStore } from "@1771technologies/lng-store";
import { getComparatorsForModel } from "../get-comparators-for-model";
import { stringComparator } from "../sort-functions/string-comparator";
import { numberComparator } from "../sort-functions/number-comparator";

test("getComparatorsForModel tests", () => {
  const state = createStore({
    sortModel: [{ columnId: "x" }, { columnId: "y" }],
    columns: [
      {
        id: "x",
      },
      { id: "y", type: "number" },
    ],
  }).state;
  const api = state.api;
  expect(getComparatorsForModel(api, state.sortModel, state.columnLookup)).toEqual([
    [stringComparator, { id: "x" }],
    [numberComparator, { id: "y", type: "number" }],
  ]);
});
