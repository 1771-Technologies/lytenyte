import { describe, test, expect } from "vitest";
import { escapeXml, XML_DECLARATION } from "./escape-xml.js";

describe("escapeXml", () => {
  test("Should escape ampersand", () => {
    expect(escapeXml("a&b")).toBe("a&amp;b");
  });

  test("Should escape less-than", () => {
    expect(escapeXml("a<b")).toBe("a&lt;b");
  });

  test("Should escape greater-than", () => {
    expect(escapeXml("a>b")).toBe("a&gt;b");
  });

  test("Should escape double quote", () => {
    expect(escapeXml('say "hi"')).toBe("say &quot;hi&quot;");
  });

  test("Should escape single quote", () => {
    expect(escapeXml("it's")).toBe("it&apos;s");
  });

  test("Should escape all five characters together", () => {
    expect(escapeXml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&apos;");
  });

  test("Should escape ampersand before others to prevent double-escaping", () => {
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
  });

  test("Should return the string unchanged when no special characters present", () => {
    expect(escapeXml("hello world")).toBe("hello world");
  });

  test("Should handle an empty string", () => {
    expect(escapeXml("")).toBe("");
  });

  test("Should start with the xml processing instruction", () => {
    expect(XML_DECLARATION).toMatch(/^<\?xml /);
  });

  test("Should specify UTF-8 encoding", () => {
    expect(XML_DECLARATION).toContain('encoding="UTF-8"');
  });

  test("Should specify standalone yes", () => {
    expect(XML_DECLARATION).toContain('standalone="yes"');
  });
});
