import { describe, test, expect, vi, afterEach } from "vitest";
import * as isElementModule from "../is-element.js";
import * as isWebKitModule from "../is-webkit.js";
import { isContainingBlock } from "../is-containing-block.js";

describe("isContainingBlock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createCss(overrides: Partial<CSSStyleDeclaration> = {}): CSSStyleDeclaration {
    return {
      transform: "none",
      translate: "none",
      scale: "none",
      rotate: "none",
      perspective: "none",
      containerType: "normal",
      backdropFilter: "none",
      filter: "none",
      willChange: "",
      contain: "",
      ...overrides,
    } as CSSStyleDeclaration;
  }

  test('returns true for transform value not "none"', () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(false);

    const css = createCss({ transform: "rotate(45deg)" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test('returns true for containerType not "normal"', () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(false);

    const css = createCss({ containerType: "size" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test('returns true for non-webkit and backdropFilter not "none"', () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(false);

    const css = createCss({ backdropFilter: "blur(5px)" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test('returns true for non-webkit and filter not "none"', () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(false);

    const css = createCss({ filter: "blur(2px)" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test("returns true when willChange includes transform-related property", () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(true);

    const css = createCss({ willChange: "transform,opacity" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test("returns true when contain includes paint/layout/strict/content", () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(true);

    const css = createCss({ contain: "layout paint" });
    expect(isContainingBlock(css)).toBe(true);
  });

  test("returns false when all conditions are unmet", () => {
    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(true);

    const css = createCss(); // All defaults: "none", "normal", ""
    expect(isContainingBlock(css)).toBe(false);
  });

  test("uses getComputedStyle when input is an Element", () => {
    const mockElement = {} as Element;
    const css = createCss({ transform: "scale(2)" });

    vi.spyOn(isElementModule, "isElement").mockReturnValue(true);
    vi.spyOn(global, "getComputedStyle").mockReturnValue(css);
    vi.spyOn(isWebKitModule, "isWebKit").mockReturnValue(false);

    expect(isContainingBlock(mockElement)).toBe(true);
  });
});
