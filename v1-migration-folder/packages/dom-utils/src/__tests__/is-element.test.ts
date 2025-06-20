import { describe, test, expect, vi, afterEach } from "vitest";
import * as hasWindowModule from "../has-window.js";
import * as getWindowModule from "../get-window.js";
import { isElement } from "../is-element.js";

describe("isElement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns false if hasWindow() is false", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(false);

    const result = isElement({});
    expect(result).toBe(false);
  });

  test("returns true for an instance of global Element", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const div = document.createElement("div");
    expect(isElement(div)).toBe(true);
  });

  test("returns true for an instance of getWindow(value).Element", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const mockWindow = {
      Element: class {},
    };
    const mockElement = new mockWindow.Element();

    vi.spyOn(getWindowModule, "getWindow").mockReturnValue(mockWindow as unknown as any);

    expect(isElement(mockElement)).toBe(true);
  });

  test("returns false for non-Element values when hasWindow is true", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    expect(isElement(null)).toBe(false);
    expect(isElement({})).toBe(false);
    expect(isElement("div")).toBe(false);
    expect(isElement(42)).toBe(false);
  });
});
