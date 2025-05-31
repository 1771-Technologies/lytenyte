import { describe, test, expect, vi, afterEach } from "vitest";
import { isOverflowElement } from "../is-overflow-element.js";

describe("isOverflowElement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns true when overflow-related styles include auto, scroll, overlay, hidden, or clip and display is not inline or contents", () => {
    const mockElement = {} as Element;
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      overflow: "auto",
      overflowX: "hidden",
      overflowY: "scroll",
      display: "block",
    } as unknown as CSSStyleDeclaration);

    expect(isOverflowElement(mockElement)).toBe(true);
  });

  test("returns false when display is inline despite matching overflow styles", () => {
    const mockElement = {} as Element;
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      overflow: "auto",
      overflowX: "auto",
      overflowY: "auto",
      display: "inline",
    } as unknown as CSSStyleDeclaration);

    expect(isOverflowElement(mockElement)).toBe(false);
  });

  test("returns false when display is contents despite matching overflow styles", () => {
    const mockElement = {} as Element;
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      overflow: "scroll",
      overflowX: "scroll",
      overflowY: "scroll",
      display: "contents",
    } as unknown as CSSStyleDeclaration);

    expect(isOverflowElement(mockElement)).toBe(false);
  });

  test("returns false when no overflow-related style matches", () => {
    const mockElement = {} as Element;
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      overflow: "visible",
      overflowX: "visible",
      overflowY: "visible",
      display: "block",
    } as unknown as CSSStyleDeclaration);

    expect(isOverflowElement(mockElement)).toBe(false);
  });
});
