import { describe, expect, test } from "vitest";
import { isRootElement } from "../is-root-element.js";

describe("isRootElement", () => {
  test("when the element provided is the <html /> element it should return true", () => {
    expect(isRootElement(document.querySelector("html")!)).toEqual(true);
  });

  test("when the element provided is the body element it should return true", () => {
    expect(isRootElement(document.querySelector("body")!)).toEqual(true);
  });

  test("when the element provided is the document it should return true", () => {
    expect(isRootElement(document)).toEqual(true);
  });

  test("when the element provided is not a root element it should return false", () => {
    const div = document.createElement("div");
    expect(isRootElement(div)).toEqual(false);
  });
});
