import { expect, test } from "@1771technologies/aio/vitest";
import { createStore } from "@1771technologies/lng-store";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-small";
import type { Column, RowNode } from "@1771technologies/grid-types";
import { dataToLeafRows, LEAF_KIND } from "@1771technologies/grid-row-utils";
import { groupSortComparator } from "../group-sort-comparator";
import {
  LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX,
  LYTENYTE_SINGLE_GROUP_COLUMN_ID,
} from "@1771technologies/grid-constants";

export const bankColumns: Column<(typeof bankDataSmall)[0], any, any>[] = [
  { id: "age", rowGroupable: true },
  { id: "job", rowGroupable: true },
  { id: "marital", rowGroupable: true },
  { id: "education" },
  { id: "default" },
  { id: "balance" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

test("groupSortComparator should return the correct result", () => {
  const ds = createStore({
    rowDataSource: {
      kind: "client",
      data: bankDataSmall,
    },
    columnBase: { rowGroupable: true },
    columns: bankColumns,
    rowGroupModel: ["age", "job", "marital"],
  });

  const [rows] = dataToLeafRows(bankDataSmall, null);

  const api = ds.state.api;

  expect(
    groupSortComparator(api, "", "", rows[0], rows[1], {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(-1);

  expect(
    groupSortComparator(api, "", "", rows[1], rows[0], {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(1);

  expect(
    groupSortComparator(api, "", "", rows[0], api.rowByIndex(0)!, {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(-1);
  expect(
    groupSortComparator(api, "", "", api.rowByIndex(0)!, rows[0], {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(1);
  expect(
    groupSortComparator(api, "", "", api.rowByIndex(0)!, api.rowByIndex(1)!, {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(0);

  expect(
    groupSortComparator(
      api,
      "",
      "",
      { kind: LEAF_KIND, data: { age: null, marital: null, job: null } } as RowNode<any>,
      { kind: LEAF_KIND, data: { age: null, marital: null, job: null } } as RowNode<any>,
      { columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID },
    ),
  ).toEqual(0);
  expect(
    groupSortComparator(
      api,
      "",
      "",
      { kind: LEAF_KIND, data: { age: null, marital: null, job: null } } as RowNode<any>,
      { kind: LEAF_KIND, data: { age: null, marital: null, job: null } } as RowNode<any>,
      { columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID, options: { nullsAppearFirst: true } },
    ),
  ).toEqual(0);

  expect(
    groupSortComparator(api, "", "", rows[0], api.rowByIndex(0)!, {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(-1);
  expect(
    groupSortComparator(api, "", "", api.rowByIndex(0)!, rows[0], {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(1);
  expect(
    groupSortComparator(api, "", "", api.rowByIndex(0)!, rows[0], {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
      options: { nullsAppearFirst: true },
    }),
  ).toEqual(-1);
  expect(
    groupSortComparator(api, "", "", api.rowByIndex(0)!, api.rowByIndex(1)!, {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(0);

  expect(
    groupSortComparator(api, "", "", rows[0], rows[0], {
      columnId: LYTENYTE_SINGLE_GROUP_COLUMN_ID,
    }),
  ).toEqual(0);

  expect(
    groupSortComparator(api, "", "", rows[0], rows[1], {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(-1);

  expect(
    groupSortComparator(api, "", "", rows[1], rows[0], {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(1);

  expect(
    groupSortComparator(api, "", "", rows[0], rows[0], {
      columnId: `${LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX}_${0}`,
    }),
  ).toEqual(0);
});
