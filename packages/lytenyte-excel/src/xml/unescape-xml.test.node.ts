import { describe, test, expect } from "vitest";
import { unescapeXml } from "./unescape-xml.js";

describe("unescapeXml", () => {
  test("Should unescape &lt;", () => {
    expect(unescapeXml("a&lt;b")).toBe("a<b");
  });

  test("Should unescape &gt;", () => {
    expect(unescapeXml("a&gt;b")).toBe("a>b");
  });

  test("Should unescape &quot;", () => {
    expect(unescapeXml("&quot;hi&quot;")).toBe('"hi"');
  });

  test("Should unescape &apos;", () => {
    expect(unescapeXml("it&apos;s")).toBe("it's");
  });

  test("Should unescape &amp;", () => {
    expect(unescapeXml("a&amp;b")).toBe("a&b");
  });

  test("Should unescape all five entities", () => {
    expect(unescapeXml("&amp;&lt;&gt;&quot;&apos;")).toBe(`&<>"'`);
  });

  test("Should unescape &amp; last so &amp;lt; becomes &lt; not <", () => {
    expect(unescapeXml("&amp;lt;")).toBe("&lt;");
  });

  test("Should return the string unchanged when no entities present", () => {
    expect(unescapeXml("hello world")).toBe("hello world");
  });

  test("Should handle an empty string", () => {
    expect(unescapeXml("")).toBe("");
  });
});
