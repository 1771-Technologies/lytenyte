import { expect, test, describe } from "vitest";
import { getRowIndexFromEl } from "../get-row-index-from-el.js";

describe("getRowIndexFromEl", () => {
  test("Should return the correct row index from element", () => {
    const x = document.createElement("div");
    x.setAttribute("data-ln-rowindex", "2");
    expect(getRowIndexFromEl(x)).toEqual(2);
  });
});
