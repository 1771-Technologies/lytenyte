import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { getChildText } from "./get-child-text.js";

describe("getChildText", () => {
  test("Should return the text of the first matching child", () => {
    const el = parseXml("<c><v>42</v></c>");

    expect(getChildText(el, "v")).toBe("42");
  });

  test("Should return undefined when no matching child exists", () => {
    const el = parseXml("<c/>");

    expect(getChildText(el, "v")).toBeUndefined();
  });

  test("Should return undefined when the matching child has no text", () => {
    const el = parseXml("<c><v/></c>");

    expect(getChildText(el, "v")).toBeUndefined();
  });

  test("Should return text from the first matching child only", () => {
    const el = parseXml("<si><t>hello</t><t>world</t></si>");

    expect(getChildText(el, "t")).toBe("hello");
  });
});
