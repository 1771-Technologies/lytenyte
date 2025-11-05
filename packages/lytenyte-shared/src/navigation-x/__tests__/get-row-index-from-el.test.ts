import { expect, test } from "vitest";
import { getRowIndexFromEl } from "../get-row-index-from-el.js";

test("getRowIndexFromEl", () => {
  const x = document.createElement("div");
  x.setAttribute("data-ln-rowindex", "2");
  expect(getRowIndexFromEl(x)).toEqual(2);
});
