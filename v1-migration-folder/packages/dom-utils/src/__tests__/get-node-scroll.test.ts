import { describe, test, expect, vi, afterEach } from "vitest";
import * as isElementModule from "../is-element.js";
import { getNodeScroll } from "../get-node-scroll.js";

describe("getNodeScroll", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns scrollLeft and scrollTop from an Element", () => {
    const element = {
      scrollLeft: 100,
      scrollTop: 200,
    } as unknown as Element;

    vi.spyOn(isElementModule, "isElement").mockReturnValue(true);

    const result = getNodeScroll(element);

    expect(result).toEqual({
      scrollLeft: 100,
      scrollTop: 200,
    });
  });

  test("returns scrollX and scrollY from a Window", () => {
    const mockWindow = {
      scrollX: 300,
      scrollY: 400,
    } as unknown as Window;

    vi.spyOn(isElementModule, "isElement").mockReturnValue(false);

    const result = getNodeScroll(mockWindow);

    expect(result).toEqual({
      scrollLeft: 300,
      scrollTop: 400,
    });
  });
});
