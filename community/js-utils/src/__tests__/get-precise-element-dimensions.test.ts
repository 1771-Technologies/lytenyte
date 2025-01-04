import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { getPreciseElementDimensions } from "../get-precise-element-dimensions";

describe("getPreciseElementDimensions", () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
  });

  // Helper to mock getBoundingClientRect
  const mockGetBoundingClientRect = (width: number, height: number) => {
    vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
  };

  // Helper to mock computed styles
  const mockComputedStyle = (styles: Partial<CSSStyleDeclaration>) => {
    vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({
      ...(styles as any),
    }));
  };

  test("basic dimensions without padding, border, or scrollbar", () => {
    mockGetBoundingClientRect(100, 50);
    mockComputedStyle({
      borderWidth: "0px",
      padding: "0px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 100 },
      offsetHeight: { value: 50 },
      clientWidth: { value: 100 },
      clientHeight: { value: 50 },
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 100,
      innerHeight: 50,
      outerWidth: 100,
      outerHeight: 50,
    });
  });

  test("dimensions with padding", () => {
    mockGetBoundingClientRect(120, 60);
    mockComputedStyle({
      borderWidth: "0px",
      paddingLeft: "5px",
      paddingRight: "5px",
      paddingTop: "5px",
      paddingBottom: "5px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 120 },
      offsetHeight: { value: 60 },
      clientWidth: { value: 120 },
      clientHeight: { value: 60 },
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 110,
      innerHeight: 50,
      outerWidth: 120,
      outerHeight: 60,
    });
  });

  test("dimensions with border", () => {
    mockGetBoundingClientRect(120, 60);
    mockComputedStyle({
      borderLeftWidth: "2px",
      borderRightWidth: "2px",
      borderTopWidth: "2px",
      borderBottomWidth: "2px",
      padding: "0px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 120 },
      offsetHeight: { value: 60 },
      clientWidth: { value: 120 },
      clientHeight: { value: 60 },
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 116,
      innerHeight: 56,
      outerWidth: 120,
      outerHeight: 60,
    });
  });

  test("dimensions with scrollbar", () => {
    mockGetBoundingClientRect(120, 60);
    mockComputedStyle({
      borderWidth: "0px",
      padding: "0px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 120 },
      offsetHeight: { value: 60 },
      clientWidth: { value: 110 }, // 10px scrollbar width
      clientHeight: { value: 50 }, // 10px scrollbar height
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 110,
      innerHeight: 50,
      outerWidth: 120,
      outerHeight: 60,
    });
  });

  test("dimensions with mixed padding, border, and scrollbar", () => {
    mockGetBoundingClientRect(150, 100);
    mockComputedStyle({
      borderLeftWidth: "2px",
      borderRightWidth: "3px",
      borderTopWidth: "2px",
      borderBottomWidth: "3px",
      paddingLeft: "5px",
      paddingRight: "8px",
      paddingTop: "5px",
      paddingBottom: "8px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 150 },
      offsetHeight: { value: 100 },
      clientWidth: { value: 140 }, // 10px scrollbar width
      clientHeight: { value: 90 }, // 10px scrollbar height
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 122, // 150 - 2 - 3 - 5 - 8 - 10
      innerHeight: 72, // 100 - 2 - 3 - 5 - 8 - 10
      outerWidth: 150,
      outerHeight: 100,
    });
  });

  test("handles missing or invalid style values", () => {
    mockGetBoundingClientRect(100, 50);
    mockComputedStyle({
      borderLeftWidth: "invalid",
      borderRightWidth: "",
      borderTopWidth: null as any,
      borderBottomWidth: undefined as any,
      paddingLeft: "auto",
      paddingRight: "",
      paddingTop: null as any,
      paddingBottom: undefined as any,
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 100 },
      offsetHeight: { value: 50 },
      clientWidth: { value: 100 },
      clientHeight: { value: 50 },
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 100,
      innerHeight: 50,
      outerWidth: 100,
      outerHeight: 50,
    });
  });

  test("handles floating point values", () => {
    mockGetBoundingClientRect(100.5, 50.5);
    mockComputedStyle({
      borderLeftWidth: "1.5px",
      borderRightWidth: "1.5px",
      borderTopWidth: "1.5px",
      borderBottomWidth: "1.5px",
      paddingLeft: "2.5px",
      paddingRight: "2.5px",
      paddingTop: "2.5px",
      paddingBottom: "2.5px",
    });

    Object.defineProperties(element, {
      offsetWidth: { value: 100.5 },
      offsetHeight: { value: 50.5 },
      clientWidth: { value: 100.5 },
      clientHeight: { value: 50.5 },
    });

    const dimensions = getPreciseElementDimensions(element);

    expect(dimensions).toEqual({
      innerWidth: 92.5, // 100.5 - (1.5 * 2) - (2.5 * 2)
      innerHeight: 42.5, // 50.5 - (1.5 * 2) - (2.5 * 2)
      outerWidth: 100.5,
      outerHeight: 50.5,
    });
  });
});
