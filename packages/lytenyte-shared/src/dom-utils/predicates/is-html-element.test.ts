import { describe, expect, test } from "vitest";
import { isHTMLElement } from "./is-html-element.js";

describe("isHTMLElement", () => {
  test("Should return true when the value is an HTML element", () => {
    expect(isHTMLElement(document.createElement("div"))).toEqual(true);
  });

  test("Should return false when the value is not an HTML element", () => {
    expect(isHTMLElement(window)).toEqual(false);
  });
});
