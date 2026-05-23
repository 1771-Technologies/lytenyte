import { describe, test, expect } from "vitest";
import { el } from "./el.js";

describe("el", () => {
  test("Should produce an opening and closing tag around content", () => {
    expect(el("row", {}, "content")).toBe("<row>content</row>");
  });

  test("Should include attributes in the opening tag", () => {
    expect(el("row", { r: "1" }, "")).toBe(`<row r="1"></row>`);
  });

  test("Should omit undefined attribute values", () => {
    expect(el("c", { r: "A1", s: undefined }, "")).toBe(`<c r="A1"></c>`);
  });

  test("Should handle nested element content", () => {
    const inner = el("v", {}, "42");
    expect(el("c", { r: "A1" }, inner)).toBe(`<c r="A1"><v>42</v></c>`);
  });

  test("Should handle empty content", () => {
    expect(el("sheetData", {}, "")).toBe("<sheetData></sheetData>");
  });
});
