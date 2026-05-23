import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { findElement } from "./find-element.js";

describe("findElement", () => {
  test("Should match the root element itself", () => {
    const root = parseXml("<sheetData/>");

    expect(findElement(root, "sheetData")).toBe(root);
  });

  test("Should find a direct child", () => {
    const root = parseXml("<root><target/></root>");
    const found = findElement(root, "target");

    expect(found?.tag).toBe("target");
  });

  test("Should find a deeply nested element via depth-first search", () => {
    const root = parseXml("<a><b><c><target/></c></b></a>");

    expect(findElement(root, "target")?.tag).toBe("target");
  });

  test("Should return the first match in document order", () => {
    const root = parseXml("<root><row r='1'/><row r='2'/></root>");
    const found = findElement(root, "row");

    expect(found?.attrs["r"]).toBe("1");
  });

  test("Should return undefined when tag is not found", () => {
    const root = parseXml("<root><child/></root>");

    expect(findElement(root, "missing")).toBeUndefined();
  });
});
