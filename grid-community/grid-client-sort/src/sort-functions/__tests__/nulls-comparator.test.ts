import { expect, test } from "@1771technologies/aio/vitest";
import { nullComparator } from "../null-comparator";

test("nullComparator should return the correct result", () => {
  expect(nullComparator(null, "a", false)).toEqual(1);
  expect(nullComparator(null, "a", true)).toEqual(-1);
  expect(nullComparator("b", null, false)).toEqual(-1);
  expect(nullComparator("b", null, true)).toEqual(1);
  expect(nullComparator(null, null, true)).toEqual(0);
  expect(nullComparator(null, null, false)).toEqual(0);
});
