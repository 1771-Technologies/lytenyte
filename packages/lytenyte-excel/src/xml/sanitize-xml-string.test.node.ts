import { describe, test, expect } from "vitest";
import { sanitizeXmlString } from "./sanitize-xml-string.js";

describe("sanitizeXmlString", () => {
  test("Should remove NUL (U+0000)", () => {
    expect(sanitizeXmlString("a\x00b")).toBe("ab");
  });

  test("Should remove control chars U+0001 through U+0008", () => {
    const controls = "\x01\x02\x03\x04\x05\x06\x07\x08";

    expect(sanitizeXmlString(`a${controls}b`)).toBe("ab");
  });

  test("Should remove vertical tab (U+000B)", () => {
    expect(sanitizeXmlString("a\x0Bb")).toBe("ab");
  });

  test("Should remove form feed (U+000C)", () => {
    expect(sanitizeXmlString("a\x0Cb")).toBe("ab");
  });

  test("Should remove control chars U+000E through U+001F", () => {
    const controls = "\x0E\x0F\x10\x1F";

    expect(sanitizeXmlString(`a${controls}b`)).toBe("ab");
  });

  test("Should remove DEL (U+007F)", () => {
    expect(sanitizeXmlString("a\x7Fb")).toBe("ab");
  });

  test("Should preserve tab (U+0009)", () => {
    expect(sanitizeXmlString("a\tb")).toBe("a\tb");
  });

  test("Should preserve newline (U+000A)", () => {
    expect(sanitizeXmlString("a\nb")).toBe("a\nb");
  });

  test("Should preserve carriage return (U+000D)", () => {
    expect(sanitizeXmlString("a\rb")).toBe("a\rb");
  });

  test("Should also escape XML special characters after stripping", () => {
    expect(sanitizeXmlString("a&b")).toBe("a&amp;b");
    expect(sanitizeXmlString("a<b")).toBe("a&lt;b");
  });

  test("Should strip illegal chars and escape special chars together", () => {
    expect(sanitizeXmlString("a\x00<b&c")).toBe("a&lt;b&amp;c");
  });

  test("Should return an empty string unchanged", () => {
    expect(sanitizeXmlString("")).toBe("");
  });
});
