import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { findElements } from "./find-elements.js";

describe("findElements", () => {
  test("Should return all elements with the given tag in document order", () => {
    const root = parseXml("<root><row r='1'/><row r='2'/><row r='3'/></root>");
    const rows = findElements(root, "row");

    expect(rows).toHaveLength(3);
    expect(rows[0].attrs["r"]).toBe("1");
    expect(rows[2].attrs["r"]).toBe("3");
  });

  test("Should find elements at multiple nesting levels", () => {
    const root = parseXml("<a><c/><b><c/></b></a>");

    expect(findElements(root, "c")).toHaveLength(2);
  });

  test("Should include the root element when it matches", () => {
    const root = parseXml("<target/>");

    expect(findElements(root, "target")).toHaveLength(1);
  });

  test("Should return an empty array when no elements match", () => {
    const root = parseXml("<root><child/></root>");

    expect(findElements(root, "missing")).toHaveLength(0);
  });
});
