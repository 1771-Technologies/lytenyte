import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";
import { findChildElement } from "./find-child-element.js";

describe("findChildElement", () => {
  test("Should return the first matching direct child", () => {
    const root = parseXml("<c><f>SUM(A1:A10)</f><v>55</v></c>");

    expect(findChildElement(root, "v")?.text).toBe("55");
  });

  test("Should return the first of multiple matching children", () => {
    const root = parseXml("<row><c r='A1'/><c r='B1'/></row>");

    expect(findChildElement(root, "c")?.attrs["r"]).toBe("A1");
  });

  test("Should not recurse into grandchildren", () => {
    const root = parseXml("<root><child><target/></child></root>");

    expect(findChildElement(root, "target")).toBeUndefined();
  });

  test("Should return undefined when no matching child exists", () => {
    const root = parseXml("<root><child/></root>");

    expect(findChildElement(root, "missing")).toBeUndefined();
  });
});
