import { describe, expect, test } from "vitest";
import { isFullWidthRow } from "../is-full-width-row";

describe("isFullWidthRow", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isFullWidthRow(el)).toEqual(false);
    el.setAttribute("data-ln-rowtype", "full-width");
    expect(isFullWidthRow(el)).toEqual(true);
  });
});
