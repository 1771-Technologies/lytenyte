import { describe, expect, test } from "vitest";
import { isHTMLElement } from "../is-html-element.js";

describe("isHTMLElement", () => {
  test("when the element provided is an HTML element it should return true", () => {
    expect(isHTMLElement(document.createElement("div"))).toEqual(true);
  });

  test("when the element provided is not an HTML element it should return false", () => {
    expect(isHTMLElement(window)).toEqual(false);
  });
});
