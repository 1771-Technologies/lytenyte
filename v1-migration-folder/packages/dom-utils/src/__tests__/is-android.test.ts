import { describe, expect, test } from "vitest";
import { isAndroid } from "../is-android";

describe("isAndroid", () => {
  test("should return false as window is not defined", () => {
    expect(isAndroid()).toEqual(false);
  });
});
