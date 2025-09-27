import { describe, expect, test } from "vitest";
import { isColumnFloatingHeader } from "../is-column-floating-header.js";

describe("isColumnFloatingHeader", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    expect(isColumnFloatingHeader(el)).toEqual(false);
    el.setAttribute("data-ln-header-floating", "true");
    expect(isColumnFloatingHeader(el)).toEqual(true);
  });
});
