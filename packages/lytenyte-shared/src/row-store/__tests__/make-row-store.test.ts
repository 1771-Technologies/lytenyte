import { expect, test } from "vitest";
import { makeRowStore } from "../make-row-store";

test("makeRowStore: should be able to create a store and grab data items", () => {
  const rowData: Record<number, number> = {};
  const rowStore = makeRowStore({
    getRow: (i) => {
      if (rowData[i] != null) return rowData[i];

      rowData[i] = 0;
      return 0;
    },
  });
  rowStore.count.set(10);

  const row = rowStore.row(2);

  expect(row.get()).toEqual(0);
  rowData[2]++;
  expect(row.get()).toEqual(0);
  rowStore.invalidate(2);
  expect(row.get()).toEqual(1);

  rowData[2]++;
  rowData[3]++;
  rowData[3]++;
  expect(rowStore.row(2).get()).toEqual(2);
  expect(rowStore.row(3).get()).toEqual(2);
  expect(row).toBe(rowStore.row(2));
});
