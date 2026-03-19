import { describe, expect, test } from "vitest";
import { isRootElement } from "./is-root-element.js";

describe("isRootElement", () => {
  test("Should return true when the element is the html element", () => {
    expect(isRootElement(document.querySelector("html")!)).toEqual(true);
  });

  test("Should return true when the element is the body element", () => {
    expect(isRootElement(document.querySelector("body")!)).toEqual(true);
  });

  test("Should return true when the value is the document", () => {
    expect(isRootElement(document)).toEqual(true);
  });

  test("Should return false when the element is not a root element", () => {
    const div = document.createElement("div");
    expect(isRootElement(div)).toEqual(false);
  });
});
