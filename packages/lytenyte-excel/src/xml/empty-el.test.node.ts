import { describe, test, expect } from "vitest";
import { emptyEl } from "./empty-el.js";

describe("emptyEl", () => {
  test("Should produce a self-closing tag with no attributes", () => {
    expect(emptyEl("br")).toBe("<br/>");
  });

  test("Should include attributes in the self-closing tag", () => {
    expect(emptyEl("mergeCell", { ref: "A1:B2" })).toBe(`<mergeCell ref="A1:B2"/>`);
  });

  test("Should omit undefined attribute values", () => {
    expect(emptyEl("col", { min: 1, max: undefined })).toBe(`<col min="1"/>`);
  });

  test("Should default to empty attributes when called with no second argument", () => {
    expect(emptyEl("selection")).toBe("<selection/>");
  });
});
