import { describe, expect, test } from "vitest";
import { isInputElement } from "../is-input-element.js";

describe("isInputElement", () => {
  test("when the element provided is an input element it should return true", () => {
    const input = document.createElement("input");

    expect(isInputElement(input)).toEqual(true);

    expect(isInputElement(document.createElement("div"))).toEqual(false);
  });

  test("when the element provided is not an HTML element it should return false", () => {
    expect(isInputElement(null as any)).toEqual(false);
  });
});
