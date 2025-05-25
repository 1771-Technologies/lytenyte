import { describe, expect, test } from "vitest";
import { isAndroid } from "../is-android.js";

describe("isAndroid", () => {
  test("should return false as window is not defined", () => {
    expect(isAndroid()).toEqual(false);
  });
});
