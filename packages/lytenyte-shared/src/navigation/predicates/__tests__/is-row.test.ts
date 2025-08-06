import { describe, expect, test } from "vitest";
import { isRow } from "../is-row";

describe("isRow", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isRow(el)).toEqual(false);
    el.setAttribute("data-ln-row", "true");
    expect(isRow(el)).toEqual(true);
  });
});
