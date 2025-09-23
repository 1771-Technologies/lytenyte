import { describe, expect, test } from "vitest";
import { isVisualViewport } from "../is-visual-viewport.js";

describe("isVisualViewport", () => {
  test("when the value provided is the visual viewport it should return true", () => {
    expect(isVisualViewport({ constructor: { name: "VisualViewport" } })).toEqual(true);
    expect(isVisualViewport({ constructor: { name: "X" } })).toEqual(false);
  });

  test("when the value provided is not valid it should return false", () => {
    expect(isVisualViewport(null)).toEqual(false);
  });
});
