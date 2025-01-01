import { expect, test } from "@1771technologies/aio/vitest";
import { dataToLeafRows } from "@1771technologies/grid-row-utils";
import { createStore } from "@1771technologies/lng-store";
import { stringComparator } from "../string-comparator";

test("stringComparator should return the correct result", () => {
  const store = createStore({
    columns: [{ id: "alpha" }],
  });
  const api = store.state.api;

  const [[leftNode, rightNode]] = dataToLeafRows([23, 34], null);

  expect(stringComparator(api, "b", "a", leftNode, rightNode, { columnId: "alpha" })).toEqual(1);
  expect(stringComparator(api, "a", "b", leftNode, rightNode, { columnId: "alpha" })).toEqual(-1);
  expect(stringComparator(api, "a", "a", leftNode, rightNode, { columnId: "alpha" })).toEqual(0);

  expect(stringComparator(api, 1, "a", leftNode, rightNode, { columnId: "alpha" })).toEqual(1);
  expect(stringComparator(api, "a", 1, leftNode, rightNode, { columnId: "alpha" })).toEqual(-1);
  expect(stringComparator(api, 1, 1, leftNode, rightNode, { columnId: "alpha" })).toEqual(0);

  expect(stringComparator(api, null, null, leftNode, rightNode, { columnId: "alpha" })).toEqual(0);
  expect(stringComparator(api, null, "a", leftNode, rightNode, { columnId: "alpha" })).toEqual(1);
  expect(stringComparator(api, "a", null, leftNode, rightNode, { columnId: "alpha" })).toEqual(-1);
  expect(
    stringComparator(api, null, "a", leftNode, rightNode, {
      columnId: "alpha",
      options: { nullsAppearFirst: true },
    }),
  ).toEqual(-1);
  expect(
    stringComparator(api, "a", null, leftNode, rightNode, {
      columnId: "alpha",
      options: { nullsAppearFirst: true },
    }),
  ).toEqual(1);

  expect(
    stringComparator(api, "b", "á", leftNode, rightNode, {
      columnId: "alpha",
      options: { isAccented: true },
    }),
  ).toEqual(1);
  expect(
    stringComparator(api, "á", "b", leftNode, rightNode, {
      columnId: "alpha",
      options: { isAccented: true },
    }),
  ).toEqual(-1);
  expect(
    stringComparator(api, "á", "á", leftNode, rightNode, {
      columnId: "alpha",
      options: { isAccented: true },
    }),
  ).toEqual(0);
  expect(
    stringComparator(api, "a", "á", leftNode, rightNode, {
      columnId: "alpha",
      options: { isAccented: true },
    }),
  ).toEqual(0);
});
