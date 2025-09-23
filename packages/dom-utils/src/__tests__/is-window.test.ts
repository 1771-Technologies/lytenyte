import { describe, expect, test } from "vitest";
import { isWindow } from "../is-window.js";

describe("isWindow", () => {
  test("when the value provided is the window it should return true", () => {
    expect(isWindow(window)).toEqual(true);
    expect(isWindow(document)).toEqual(false);
  });
  test("when the value provided is not valid it should return false", () => {
    expect(isWindow(null)).toEqual(false);
  });
});
