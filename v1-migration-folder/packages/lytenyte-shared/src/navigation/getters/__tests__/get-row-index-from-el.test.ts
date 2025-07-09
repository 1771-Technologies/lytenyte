import { describe, expect, test } from "vitest";
import { getRowIndexFromEl } from "../get-row-index-from-el";

describe("getRowIndexFromEl", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(getRowIndexFromEl(el)).toEqual(NaN);
    el.setAttribute("data-ln-rowindex", "23");
    expect(getRowIndexFromEl(el)).toEqual(23);
  });
});
