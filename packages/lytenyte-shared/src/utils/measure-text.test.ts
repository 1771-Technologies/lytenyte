import { describe, expect, test } from "vitest";
import { measureText } from "./measure-text.js";

describe("measureText", () => {
  test("Should be able to measure text correctly", () => {
    const text = "This is my text";

    expect(measureText(text)?.width).toBeGreaterThan(0);
    expect(measureText(text)?.width).toBeGreaterThan(0);
    expect(measureText(text, document.body)?.width).toBeGreaterThan(0);
    expect(measureText(text, "body")?.width).toBeGreaterThan(0);

    expect(measureText(text, "body")?.width).toBeGreaterThan(0);
  });
});
