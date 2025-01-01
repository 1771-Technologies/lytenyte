import { expect, test } from "@1771technologies/aio/vitest";
import { dataToLeafRows } from "@1771technologies/grid-row-utils";
import { createStore } from "@1771technologies/lng-store";
import { numberComparator } from "../number-comparator";

test("numberComparator should return the correct result", () => {
  const store = createStore({
    columns: [{ id: "alpha" }],
  });
  const api = store.state.api;

  const [[leftNode, rightNode]] = dataToLeafRows([23, 34], null);

  expect(numberComparator(api, 23, 33, leftNode, rightNode, { columnId: "alpha" })).toEqual(-10);
  expect(numberComparator(api, 33, 23, leftNode, rightNode, { columnId: "alpha" })).toEqual(10);
  expect(numberComparator(api, 33, 33, leftNode, rightNode, { columnId: "alpha" })).toEqual(0);
  expect(numberComparator(api, null, 33, leftNode, rightNode, { columnId: "alpha" })).toEqual(1);
  expect(
    numberComparator(api, null, 33, leftNode, rightNode, {
      columnId: "alpha",
      options: { nullsAppearFirst: true },
    }),
  ).toEqual(-1);
  expect(numberComparator(api, 33, "23", leftNode, rightNode, { columnId: "alpha" })).toEqual(-1);
  expect(numberComparator(api, "23", 23, leftNode, rightNode, { columnId: "alpha" })).toEqual(1);
  expect(numberComparator(api, "23", "a", leftNode, rightNode, { columnId: "alpha" })).toEqual(0);
  expect(
    numberComparator(api, -33, 33, leftNode, rightNode, {
      columnId: "alpha",
      options: { isAbsolute: true },
    }),
  ).toEqual(0);
});
