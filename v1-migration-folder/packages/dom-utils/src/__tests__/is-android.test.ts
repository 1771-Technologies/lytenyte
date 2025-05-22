import { expect, test } from "vitest";
import { isAndroid } from "../is-android";

test("isAndroid: should return false as window is not defined", () => {
  expect(isAndroid()).toEqual(false);
});
