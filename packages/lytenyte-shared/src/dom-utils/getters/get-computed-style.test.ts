import { describe, expect, test } from "vitest";
import { getComputedStyle } from "./get-computed-style.js";

describe("getComputedStyled", () => {
  test("Should return a CSSStyleDeclaration for the element", () => {
    expect(getComputedStyle(document.body)).not.toBeUndefined();
  });
});
