import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { findChildElements } from "./find-child-elements.js";

describe("findChildElements", () => {
  test("Should return all matching direct children", () => {
    const root = parseXml("<row><c r='A1'/><c r='B1'/><c r='C1'/></row>");
    const cells = findChildElements(root, "c");

    expect(cells).toHaveLength(3);
    expect(cells[1].attrs["r"]).toBe("B1");
  });

  test("Should not recurse into grandchildren", () => {
    const root = parseXml("<root><child><c/></child><c/></root>");
    const cells = findChildElements(root, "c");

    expect(cells).toHaveLength(1);
  });

  test("Should return an empty array when no direct children match", () => {
    const root = parseXml("<root><child/></root>");

    expect(findChildElements(root, "missing")).toHaveLength(0);
  });

  test("Should return an empty array for a leaf element", () => {
    const root = parseXml("<leaf/>");

    expect(findChildElements(root, "anything")).toHaveLength(0);
  });
});
