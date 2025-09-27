import { describe, expect, test } from "vitest";
import { isDocument } from "../is-document.js";

describe("isDocument", () => {
  test("when the element provided is not a document element it should return false", () => {
    expect(isDocument(document.createElement("div"))).toEqual(false);
  });
  test("when the document is provided it should return true", () => {
    expect(isDocument(document)).toEqual(true);
  });

  test("when a bad value is provided it should return false", () => {
    expect(isDocument(null)).toEqual(false);
  });
});
