import { describe, expect, test, vi } from "vitest";
import { supportsScrollEnd } from "./supports-scroll-end.js";

describe("supportsScrollEnd", () => {
  test("Should return the correct value if onscroll end is supported", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "onscrollend", "get").mockImplementationOnce(() => () => ({}));
    expect(supportsScrollEnd(el)).toEqual(true);
  });
});
