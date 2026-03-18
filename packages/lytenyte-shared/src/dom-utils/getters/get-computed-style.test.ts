import { describe, expect, test } from "vitest";
import { getComputedStyle } from "./get-computed-style.js";

describe("getComputedStyled", () => {
  test("getComputedStyle", () => {
    expect(getComputedStyle(document.body)).not.toBeUndefined();
  });
});
