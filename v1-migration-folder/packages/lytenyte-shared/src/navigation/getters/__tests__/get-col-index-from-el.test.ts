import { describe, expect, test } from "vitest";
import { getColIndexFromEl } from "../get-col-index-from-el";

describe("getColIndexFromEl", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    el.setAttribute("data-ln-colindex", "23");

    expect(getColIndexFromEl(el)).toEqual(23);

    const el2 = document.createElement("div");
    expect(getColIndexFromEl(el2)).toEqual(NaN);
  });
});
