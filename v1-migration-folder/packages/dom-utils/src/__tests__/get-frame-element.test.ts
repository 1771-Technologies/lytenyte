import { describe, test, expect, vi } from "vitest";
import { getFrameElement } from "../get-frame-element.js";

describe("getFrameElement", () => {
  test("returns frameElement when parent exists and has prototype", () => {
    const mockFrame = {} as Element;
    const parentWindow = {};

    const mockWindow = {
      parent: parentWindow,
      frameElement: mockFrame,
    } as unknown as Window;

    vi.spyOn(Object, "getPrototypeOf").mockReturnValueOnce({}); // Prototype exists

    const result = getFrameElement(mockWindow);
    expect(result).toBe(mockFrame);
  });

  test("returns null when win.parent is null", () => {
    const mockWindow = {
      parent: null,
      frameElement: {} as Element,
    } as unknown as Window;

    const result = getFrameElement(mockWindow);
    expect(result).toBeNull();
  });

  test("returns null when win.parent has no prototype", () => {
    const parentWindow = {};
    const mockWindow = {
      parent: parentWindow,
      frameElement: {} as Element,
    } as unknown as Window;

    vi.spyOn(Object, "getPrototypeOf").mockReturnValueOnce(null); // Simulate no prototype

    const result = getFrameElement(mockWindow);
    expect(result).toBeNull();
  });
});
