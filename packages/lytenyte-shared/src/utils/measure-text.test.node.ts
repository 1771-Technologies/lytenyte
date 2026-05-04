import { describe, expect, test } from "vitest";
import { measureText } from "./measure-text.js";

describe("measureText", () => {
  test("Should be able to measure text correctly", () => {
    const text = "This is my text";

    expect(measureText(text)).toBe(null);
  });
});
