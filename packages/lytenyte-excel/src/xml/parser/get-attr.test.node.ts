import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { getAttr } from "./get-attr.js";

describe("getAttr", () => {
  test("Should return the attribute value", () => {
    const el = parseXml(`<c r="A1" s="3"/>`);

    expect(getAttr(el, "r")).toBe("A1");
    expect(getAttr(el, "s")).toBe("3");
  });

  test("Should return undefined for a missing attribute", () => {
    const el = parseXml("<c/>");

    expect(getAttr(el, "r")).toBeUndefined();
  });

  test("Should return already-unescaped attribute values", () => {
    const el = parseXml(`<el name="a &amp; b"/>`);

    expect(getAttr(el, "name")).toBe("a & b");
  });
});
