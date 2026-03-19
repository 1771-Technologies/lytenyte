import { describe, expect, test } from "vitest";
import { isWindow } from "./is-window.js";

describe("isWindow", () => {
  test("Should return true when the value is the window and false for the document", () => {
    expect(isWindow(window)).toEqual(true);
    expect(isWindow(document)).toEqual(false);
  });
  test("Should return false when the value is null", () => {
    expect(isWindow(null)).toEqual(false);
  });
});
