import { describe, expect, test } from "vitest";
import { isHeader } from "../is-header.js";

describe("isHeader", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isHeader(el)).toEqual(false);
    el.setAttribute("data-ln-header", "true");
    expect(isHeader(el)).toEqual(true);
  });
});
