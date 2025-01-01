import { datatypeComparator } from "../datatype-comparator";

test("datatypeComparator should return the correct result", () => {
  expect(datatypeComparator("a", 1, "string")).toEqual(-1);
  expect(datatypeComparator(1, "a", "string")).toEqual(1);
  expect(datatypeComparator("a", "aa", "string")).toEqual(0);
});
