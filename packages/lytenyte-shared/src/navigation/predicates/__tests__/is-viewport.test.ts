import { describe, expect, test } from "vitest";
import { isViewport } from "../is-viewport.js";

describe("isViewport", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isViewport(el)).toEqual(false);
    el.setAttribute("data-ln-viewport", "true");
    expect(isViewport(el)).toEqual(true);
  });
});
