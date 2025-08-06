import { describe, expect, test } from "vitest";
import { isCell } from "../is-cell";

describe("isCell", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isCell(el)).toEqual(false);
    el.setAttribute("data-ln-cell", "true");
    expect(isCell(el)).toEqual(true);
  });
});
