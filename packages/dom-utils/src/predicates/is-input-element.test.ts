import { describe, expect, test } from "vitest";
import { isInputElement } from "./is-input-element.js";

describe("isInputElement", () => {
  test("Should return true when the element is an input element and false for other elements", () => {
    const input = document.createElement("input");

    expect(isInputElement(input)).toEqual(true);

    expect(isInputElement(document.createElement("div"))).toEqual(false);
  });

  test("Should return false when the value is not an HTML element", () => {
    expect(isInputElement(null as any)).toEqual(false);
  });
});
