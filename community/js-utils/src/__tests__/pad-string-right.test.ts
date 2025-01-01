import { padStringRight } from "../pad-string-right.js";

describe("padStringRight", () => {
  test("returns original string when length is equal to target", () => {
    expect(padStringRight("hello", 5)).toBe("hello");
  });

  test("returns original string when length is greater than target", () => {
    expect(padStringRight("hello world", 5)).toBe("hello world");
  });

  test("pads with spaces by default", () => {
    expect(padStringRight("abc", 5)).toBe("abc  ");
  });

  test("pads with custom character", () => {
    expect(padStringRight("123", 5, "0")).toBe("12300");
  });

  test("handles empty string input", () => {
    expect(padStringRight("", 3)).toBe("   ");
    expect(padStringRight("", 3, "0")).toBe("000");
  });

  test("handles zero target length", () => {
    expect(padStringRight("test", 0)).toBe("test");
  });

  test("handles unicode characters as padding", () => {
    expect(padStringRight("abc", 5, "🌟")).toBe("abc🌟🌟");
  });

  test("handles whitespace input", () => {
    expect(padStringRight("   ", 5)).toBe("     ");
  });

  test("handles special characters", () => {
    expect(padStringRight("\n\t", 4)).toBe("\n\t  ");
  });

  test("handles large padding lengths", () => {
    expect(padStringRight("x", 1000, "-")).toBe("x" + "-".repeat(999));
  });

  test("maintains exact target length", () => {
    const result = padStringRight("test", 10, "*");
    expect(result.length).toBe(10);
    expect(result).toBe("test******");
  });

  test("handles mixed string content with padding", () => {
    expect(padStringRight("a b c", 8, "-")).toBe("a b c---");
  });

  test("preserves trailing whitespace in input", () => {
    expect(padStringRight("test  ", 8, "*")).toBe("test  **");
  });
});
