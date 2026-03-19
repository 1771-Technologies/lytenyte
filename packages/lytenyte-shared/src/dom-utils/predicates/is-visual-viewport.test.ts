import { describe, expect, test } from "vitest";
import { isVisualViewport } from "./is-visual-viewport.js";

describe("isVisualViewport", () => {
  test("Should return true when the value is a VisualViewport and false otherwise", () => {
    expect(isVisualViewport({ constructor: { name: "VisualViewport" } })).toEqual(true);
    expect(isVisualViewport({ constructor: { name: "X" } })).toEqual(false);
  });

  test("Should return false when the value is null", () => {
    expect(isVisualViewport(null)).toEqual(false);
  });
});
