import { describe, expect, test } from "vitest";
import { getColSpanFromEl } from "../get-col-span-from-el";

describe("getColSpanFromEl", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");

    el.setAttribute("data-ln-colspan", "3");
    expect(getColSpanFromEl(el)).toEqual(3);

    expect(getColSpanFromEl(document.createElement("div"))).toEqual(NaN);
  });
});
