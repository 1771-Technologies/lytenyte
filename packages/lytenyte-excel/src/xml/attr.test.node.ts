import { describe, test, expect } from "vitest";
import { attr } from "./attr.js";

describe("attr", () => {
  test("Should return a space-prefixed name=value attribute", () => {
    expect(attr("r", "1")).toBe(` r="1"`);
  });

  test("Should return an empty string when value is undefined", () => {
    expect(attr("r", undefined)).toBe("");
  });

  test("Should convert a number value to string", () => {
    expect(attr("s", 42)).toBe(` s="42"`);
  });

  test("Should convert a boolean value to string", () => {
    expect(attr("hidden", true)).toBe(` hidden="true"`);
    expect(attr("hidden", false)).toBe(` hidden="false"`);
  });

  test("Should escape special characters in the value", () => {
    expect(attr("name", 'say "hi"')).toBe(` name="say &quot;hi&quot;"`);
    expect(attr("val", "a&b")).toBe(` val="a&amp;b"`);
  });
});
