import { expect, test } from "@1771technologies/aio/vitest";
import { dataToLeafRows } from "@1771technologies/grid-row-utils";
import { createStore } from "@1771technologies/lng-store";
import { dateComparator } from "../date-comparator";

test("dateComparator should return the correct result", () => {
  const store = createStore({
    columns: [
      {
        id: "alpha",
      },
      { id: "x", sortParams: { toDate: (d) => new Date(d as string) } },
      { id: "y", filterParams: { toDate: (d) => new Date(d as string) } },
    ],
  });
  const api = store.state.api;

  const [[leftNode, rightNode]] = dataToLeafRows([23, 34], null);

  expect(
    dateComparator(api, "2023-01-01", "2022-01-01", leftNode, rightNode, { columnId: "alpha" }),
  ).toEqual(1);
  expect(
    dateComparator(api, "2023-01-01", "2024-01-01", leftNode, rightNode, { columnId: "alpha" }),
  ).toEqual(-1);
  expect(
    dateComparator(api, "2023-01-01", "2023-01-01", leftNode, rightNode, { columnId: "alpha" }),
  ).toEqual(0);

  expect(
    dateComparator(api, "2023-01-01", "2023-01-01", leftNode, rightNode, { columnId: "x" }),
  ).toEqual(0);

  expect(
    dateComparator(api, "2023-01-01", "2023-01-01", leftNode, rightNode, { columnId: "y" }),
  ).toEqual(0);

  expect(dateComparator(api, null, "2023-01-01", leftNode, rightNode, { columnId: "y" })).toEqual(
    1,
  );
  expect(dateComparator(api, "2023-01-01", null, leftNode, rightNode, { columnId: "y" })).toEqual(
    -1,
  );
  expect(dateComparator(api, null, null, leftNode, rightNode, { columnId: "y" })).toEqual(0);
  expect(
    dateComparator(api, null, null, leftNode, rightNode, {
      columnId: "y",
      options: { nullsAppearFirst: true },
    }),
  ).toEqual(0);
  expect(dateComparator(api, "adf", "2023-01-01", leftNode, rightNode, { columnId: "y" })).toEqual(
    1,
  );
  expect(dateComparator(api, "2023-01-01", "afs", leftNode, rightNode, { columnId: "y" })).toEqual(
    -1,
  );
  expect(dateComparator(api, "aa", "afs", leftNode, rightNode, { columnId: "y" })).toEqual(0);
});
