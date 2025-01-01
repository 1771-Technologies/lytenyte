import { describe, expect, test } from "@1771technologies/aio/vitest";
import { createStore } from "@1771technologies/lng-store";
import { getSortComparator } from "../get-sort-comparator";
import {
  LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX,
  LYTENYTE_SINGLE_GROUP_COLUMN_ID,
} from "@1771technologies/grid-constants";
import { groupSortComparator } from "../sort-functions/group-sort-comparator";
import { stringComparator } from "../sort-functions/string-comparator";
import { dateComparator } from "../sort-functions/date-comparator";
import { numberComparator } from "../sort-functions/number-comparator";

describe("getSortComparator tests", () => {
  test("should return the correct result", () => {
    const abc = () => 1;
    const store = createStore({
      sortComparatorFuncs: {
        abc,
      },
    });
    const api = store.state.api;

    const fn = () => 2;
    expect(getSortComparator(api, { id: "x", sortComparator: fn })).toBe(fn);

    expect(getSortComparator(api, { id: LYTENYTE_MULTI_GROUP_COLUMN_ID_PREFIX })).toBe(
      groupSortComparator,
    );
    expect(getSortComparator(api, { id: LYTENYTE_SINGLE_GROUP_COLUMN_ID })).toBe(
      groupSortComparator,
    );
    expect(getSortComparator(api, { id: "x" })).toBe(stringComparator);
    expect(getSortComparator(api, { id: "x", type: "date" })).toBe(dateComparator);
    expect(getSortComparator(api, { id: "x", type: "number" })).toBe(numberComparator);

    expect(getSortComparator(api, { id: "x", sortComparator: "string" })).toBe(stringComparator);
    expect(getSortComparator(api, { id: "x", sortComparator: "number" })).toBe(numberComparator);
    expect(getSortComparator(api, { id: "x", sortComparator: "date" })).toBe(dateComparator);

    expect(getSortComparator(api, { id: "x", sortComparator: "abc" })).toBe(abc);
    expect(() =>
      getSortComparator(api, { id: "x", sortComparator: "v" }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Failed to find a sort comparator with the name: v]`,
    );
  });
});
