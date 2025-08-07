import { describe, expect, test } from "vitest";
import { getRowSpanFromEl } from "../get-row-span-from-el.js";

describe("getRowSpanFromEl", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(getRowSpanFromEl(el)).toEqual(NaN);
    el.setAttribute("data-ln-rowspan", "23");
    expect(getRowSpanFromEl(el)).toEqual(23);
  });
});
