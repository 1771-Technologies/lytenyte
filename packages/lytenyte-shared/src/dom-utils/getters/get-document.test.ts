import { describe, expect, test, vi } from "vitest";
import { getDocument } from "./get-document.js";

describe("getDocument", () => {
  test("Should return the document when the document itself is passed", () => {
    expect(getDocument(document)).toBe(document);
  });

  test("Should return the document when a window object is passed", () => {
    expect(getDocument(window)).toBe(document);
  });

  test("Should return the global document when the element has no ownerDocument", () => {
    const el = document.createElement("div");

    vi.spyOn(el, "ownerDocument", "get").mockImplementation(() => null as any);
    expect(el.ownerDocument).toBe(null);
    expect(getDocument(el)).toBe(document);
  });

  test("Should return the global document when null is passed", () => {
    expect(getDocument(null)).toBe(document);
  });
});
