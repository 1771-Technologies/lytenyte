import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { handleSizeBounds } from "../handle-size-bounds.js";

describe("handleSizeBounds", () => {
  beforeEach(() => {
    // Set default window dimensions
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(1000);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(800);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should not modify values within bounds", () => {
    const result = handleSizeBounds(100, 100, 200, 200);
    expect(result).toEqual({
      x: 100,
      y: 100,
      w: 200,
      h: 200,
    });
  });

  test("should adjust negative x to 0", () => {
    const result = handleSizeBounds(-50, 100, 200, 200);
    expect(result.x).toBe(0);
    expect(result.w).toBe(200);
  });

  test("should adjust negative y to 0", () => {
    const result = handleSizeBounds(100, -50, 200, 200);
    expect(result.y).toBe(0);
    expect(result.h).toBe(200);
  });

  test("should adjust width when element extends beyond window width", () => {
    const result = handleSizeBounds(900, 100, 200, 200);
    expect(result.x).toBe(800);
    expect(result.w).toBe(200);
  });

  test("should adjust height when element extends beyond window height", () => {
    const result = handleSizeBounds(100, 700, 200, 200);
    expect(result.y).toBe(600);
    expect(result.h).toBe(200);
  });

  test("should handle case where x offset is less than overflow amount", () => {
    const result = handleSizeBounds(50, 100, 1000, 200);
    expect(result.x).toBe(0);
    expect(result.w).toBe(1000);
  });

  test("should handle case where y offset is less than overflow amount", () => {
    const result = handleSizeBounds(100, 50, 200, 800);
    expect(result.y).toBe(0);
    expect(result.h).toBe(800);
  });

  test("should handle element wider than window", () => {
    const result = handleSizeBounds(0, 100, 1200, 200);
    expect(result.x).toBe(0);
    expect(result.w).toBe(1000);
  });

  test("should handle element taller than window", () => {
    const result = handleSizeBounds(100, 0, 200, 1000);
    expect(result.y).toBe(0);
    expect(result.h).toBe(800);
  });

  test("should handle element larger than window in both dimensions", () => {
    const result = handleSizeBounds(0, 0, 1200, 1000);
    expect(result).toEqual({
      x: 0,
      y: 0,
      w: 1000,
      h: 800,
    });
  });

  test("should handle element positioned outside window with large dimensions", () => {
    const result = handleSizeBounds(900, 700, 300, 300);
    expect(result.x).toBe(700);
    expect(result.y).toBe(500);
    expect(result.w).toBe(300);
    expect(result.h).toBe(300);
  });

  test("should handle zero dimensions", () => {
    const result = handleSizeBounds(100, 100, 0, 0);
    expect(result).toEqual({
      x: 100,
      y: 100,
      w: 0,
      h: 0,
    });
  });
});
