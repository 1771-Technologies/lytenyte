import { describe, test, expect } from "vitest";
import { attrs } from "./attrs.js";

describe("attrs", () => {
  test("Should return a single attribute string", () => {
    expect(attrs({ r: "1" })).toBe(` r="1"`);
  });

  test("Should return multiple attributes concatenated", () => {
    expect(attrs({ r: "1", s: 2 })).toBe(` r="1" s="2"`);
  });

  test("Should omit keys whose value is undefined", () => {
    expect(attrs({ r: "1", s: undefined, t: "n" })).toBe(` r="1" t="n"`);
  });

  test("Should return an empty string for an empty object", () => {
    expect(attrs({})).toBe("");
  });

  test("Should return an empty string when all values are undefined", () => {
    expect(attrs({ r: undefined, s: undefined })).toBe("");
  });

  test("Should escape special characters in values", () => {
    expect(attrs({ name: "a&b" })).toBe(` name="a&amp;b"`);
  });

  test("Should convert number and boolean values to strings", () => {
    expect(attrs({ n: 10, b: true })).toBe(` n="10" b="true"`);
  });
});
