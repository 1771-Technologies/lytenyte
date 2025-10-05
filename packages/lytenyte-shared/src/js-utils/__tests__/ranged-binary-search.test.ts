import { expect, test } from "vitest";
import { rangedBinarySearch } from "../ranged-binary-search.js";

test("Return the correct values", () => {
  const range = new Uint32Array([0, 20, 30, 60, 100, 200, 280, 400, 460]);

  expect(rangedBinarySearch(range, -20)).toEqual(0);
  expect(rangedBinarySearch(range, 0)).toEqual(0);
  expect(rangedBinarySearch(range, 20)).toEqual(1);
  expect(rangedBinarySearch(range, 25)).toEqual(1);
  expect(rangedBinarySearch(range, 30)).toEqual(2);
  expect(rangedBinarySearch(range, 100)).toEqual(4);
  expect(rangedBinarySearch(range, 110)).toEqual(4);
  expect(rangedBinarySearch(range, 210)).toEqual(5);
  expect(rangedBinarySearch(range, 450)).toEqual(7);
  expect(rangedBinarySearch(range, 460)).toEqual(8);
  expect(rangedBinarySearch(range, 500)).toEqual(8);
});
