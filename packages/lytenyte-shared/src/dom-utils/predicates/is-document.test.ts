import { describe, expect, test } from "vitest";
import { isDocument } from "./is-document.js";

describe("isDocument", () => {
  test("Should return false when the value is not a document", () => {
    expect(isDocument(document.createElement("div"))).toEqual(false);
  });
  test("Should return true when the document is provided", () => {
    expect(isDocument(document)).toEqual(true);
  });

  test("Should return false when a null value is provided", () => {
    expect(isDocument(null)).toEqual(false);
  });
});
