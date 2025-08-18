import { describe, test, expect, vi } from "vitest";
import { isTopLayer } from "../is-top-layer.js";

describe("isTopLayer", () => {
  test('returns true if element matches ":popover-open"', () => {
    const element = {
      matches: vi.fn((selector) => selector === ":popover-open"),
    } as unknown as Element;

    expect(isTopLayer(element)).toBe(true);
    expect(element.matches).toHaveBeenCalledWith(":popover-open");
  });

  test('returns true if element matches ":modal"', () => {
    const element = {
      matches: vi.fn((selector) => selector === ":modal"),
    } as unknown as Element;

    expect(isTopLayer(element)).toBe(true);
    expect(element.matches).toHaveBeenCalledWith(":popover-open");
    expect(element.matches).toHaveBeenCalledWith(":modal");
  });

  test("returns false if element matches neither selector", () => {
    const element = {
      matches: vi.fn(() => false),
    } as unknown as Element;

    expect(isTopLayer(element)).toBe(false);
    expect(element.matches).toHaveBeenCalledWith(":popover-open");
    expect(element.matches).toHaveBeenCalledWith(":modal");
  });

  test("handles errors thrown by element.matches and returns false", () => {
    const element = {
      matches: vi.fn(() => {
        throw new Error("Invalid selector");
      }),
    } as unknown as Element;

    expect(isTopLayer(element)).toBe(false);
    expect(element.matches).toHaveBeenCalledWith(":popover-open");
  });
});
