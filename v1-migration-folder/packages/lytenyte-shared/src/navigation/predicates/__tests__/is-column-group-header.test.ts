import { describe, expect, test } from "vitest";
import { isColumnGroupHeader } from "../is-column-group-header";

describe("isColumnGroupHeader", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isColumnGroupHeader(el)).toEqual(false);
    el.setAttribute("data-ln-header-group", "true");
    expect(isColumnGroupHeader(el)).toEqual(true);
  });
});
