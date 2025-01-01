import { padStringLeft } from "../pad-string-left.js";

describe("padStringLeft", () => {
  test("returns original string when length is equal to target", () => {
    expect(padStringLeft("hello", 5)).toBe("hello");
  });

  test("returns original string when length is greater than target", () => {
    expect(padStringLeft("hello world", 5)).toBe("hello world");
  });

  test("pads with spaces by default", () => {
    expect(padStringLeft("abc", 5)).toBe("  abc");
  });

  test("pads with custom character", () => {
    expect(padStringLeft("123", 5, "0")).toBe("00123");
  });

  test("handles empty string input", () => {
    expect(padStringLeft("", 3)).toBe("   ");
    expect(padStringLeft("", 3, "0")).toBe("000");
  });

  test("handles zero target length", () => {
    expect(padStringLeft("test", 0)).toBe("test");
  });

  test("handles unicode characters as padding", () => {
    expect(padStringLeft("abc", 5, "🌟")).toBe("🌟🌟abc");
  });

  test("handles whitespace input", () => {
    expect(padStringLeft("   ", 5)).toBe("     ");
  });

  test("handles special characters", () => {
    expect(padStringLeft("\n\t", 4)).toBe("  \n\t");
  });

  test("handles large padding lengths", () => {
    expect(padStringLeft("x", 1000, "-")).toBe("-".repeat(999) + "x");
  });

  test("maintains exact target length", () => {
    const result = padStringLeft("test", 10, "*");
    expect(result.length).toBe(10);
    expect(result).toBe("******test");
  });
});
