import { describe, test, expect, vi, afterEach } from "vitest";
import { getComputedStyle } from "../get-computed-style.js"; // Replace with actual module path
import * as getWindowModule from "../get-window.js";

describe("getComputedStyle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns result of getWindow(element).getComputedStyle(element)", () => {
    const element = {} as Element;
    const mockStyle = {} as CSSStyleDeclaration;

    const mockWindow = {
      getComputedStyle: vi.fn().mockReturnValue(mockStyle),
    } as unknown as Window;

    const getWindowSpy = vi.spyOn(getWindowModule, "getWindow").mockReturnValue(mockWindow as any);

    const result = getComputedStyle(element);

    expect(getWindowSpy).toHaveBeenCalledWith(element);
    expect(mockWindow.getComputedStyle).toHaveBeenCalledWith(element);
    expect(result).toBe(mockStyle);
  });
});
