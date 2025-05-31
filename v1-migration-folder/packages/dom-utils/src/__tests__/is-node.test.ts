import { describe, it, expect, vi, afterEach } from "vitest";
import * as hasWindowModule from "../has-window.js";
import * as getWindowModule from "../get-window.js";
import { isNode } from "../is-node.js";

describe("isNode", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false if hasWindow() is false", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(false);

    const result = isNode({});
    expect(result).toBe(false);
  });

  it("should return true if value is an instance of global Node", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const div = document.createElement("div");
    expect(isNode(div)).toBe(true);
  });

  it("should return true if value is an instance of getWindow(value).Node", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const mockWindow = {
      Node: class {},
    };

    const mockNode = new mockWindow.Node();
    vi.spyOn(getWindowModule, "getWindow").mockReturnValue(mockWindow as unknown as any);

    expect(isNode(mockNode)).toBe(true);
  });

  it("should return false for non-Node values when hasWindow() is true", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    expect(isNode(null)).toBe(false);
    expect(isNode({})).toBe(false);
    expect(isNode("string")).toBe(false);
    expect(isNode(123)).toBe(false);
  });
});
