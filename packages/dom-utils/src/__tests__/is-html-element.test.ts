import { describe, test, expect, vi, afterEach } from "vitest";
import * as hasWindowModule from "../has-window.js";
import * as getWindowModule from "../get-window.js";
import { isHTMLElement } from "../is-html-element.js";

describe("isHTMLElement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns false if hasWindow() is false", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(false);

    const result = isHTMLElement({});
    expect(result).toBe(false);
  });

  test("returns true if value is an instance of global HTMLElement", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    const element = document.createElement("div");
    expect(isHTMLElement(element)).toBe(true);
  });

  test("returns true if value is an instance of getWindow(value).HTMLElement", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    class CustomHTMLElement {}
    const mockWindow = {
      HTMLElement: CustomHTMLElement,
    };
    const mockElement = new CustomHTMLElement();

    vi.spyOn(getWindowModule, "getWindow").mockReturnValue(mockWindow as unknown as any);

    expect(isHTMLElement(mockElement)).toBe(true);
  });

  test("returns false for non-HTMLElement values when hasWindow is true", () => {
    vi.spyOn(hasWindowModule, "hasWindow").mockReturnValue(true);

    expect(isHTMLElement(null)).toBe(false);
    expect(isHTMLElement({})).toBe(false);
    expect(isHTMLElement("not-an-element")).toBe(false);
    expect(isHTMLElement(123)).toBe(false);
  });
});
