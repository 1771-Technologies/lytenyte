import { describe, expect, test } from "vitest";
import { isHeaderRow } from "../is-header-row.js";

describe("isHeaderRow", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isHeaderRow(el)).toEqual(false);
    el.setAttribute("data-ln-header-row", "true");
    expect(isHeaderRow(el)).toEqual(true);
  });
});
