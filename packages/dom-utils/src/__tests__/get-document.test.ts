import { describe, expect, test, vi } from "vitest";
import { getDocument } from "../get-document.js";

describe("getDocument", () => {
  test("When the document itself is passed in, it should just be returned", () => {
    expect(getDocument(document)).toBe(document);
  });

  test("When passing in a window object, the document element should be returned", () => {
    expect(getDocument(window)).toBe(document);
  });

  test("When the element does not have a ownerDocument, the document should be returned", () => {
    const el = document.createElement("div");

    vi.spyOn(el, "ownerDocument", "get").mockImplementation(() => null as any);
    expect(el.ownerDocument).toBe(null);
    expect(getDocument(el)).toBe(document);
  });

  test("When the element is not defined, the document should returned", () => {
    expect(getDocument(null)).toBe(document);
  });
});
