import { describe, test, expect, vi, afterEach } from "vitest";
import * as getNodeNameModule from "../get-node-name.js";
import { isTableElement } from "../is-table-element.js";

describe("isTableElement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns true when node name is "table"', () => {
    const mockElement = {} as Element;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("table");

    expect(isTableElement(mockElement)).toBe(true);
  });

  test('returns true when node name is "td"', () => {
    const mockElement = {} as Element;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("td");

    expect(isTableElement(mockElement)).toBe(true);
  });

  test('returns true when node name is "th"', () => {
    const mockElement = {} as Element;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("th");

    expect(isTableElement(mockElement)).toBe(true);
  });

  test("returns false when node name is not a table-related element", () => {
    const mockElement = {} as Element;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");

    expect(isTableElement(mockElement)).toBe(false);
  });
});
