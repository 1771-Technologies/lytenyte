import { beforeEach, describe, expect, test } from "vitest";
import { containsPoint } from "../contains-point.js";

describe("containsPoint", () => {
  let element: HTMLElement;

  beforeEach(() => {
    // Create a mock element with getBoundingClientRect
    element = {
      getBoundingClientRect: () => ({
        top: 100,
        right: 200,
        bottom: 300,
        left: 50,
        width: 150,
        height: 200,
        x: 50,
        y: 100,
      }),
    } as HTMLElement;
  });

  test("should return true when point is inside element boundaries", () => {
    expect(containsPoint(element, 100, 200)).toBe(true);
  });

  test("should return true when point is exactly on the boundaries", () => {
    // Test corners
    expect(containsPoint(element, 50, 100)).toBe(true); // Top-left
    expect(containsPoint(element, 200, 100)).toBe(true); // Top-right
    expect(containsPoint(element, 50, 300)).toBe(true); // Bottom-left
    expect(containsPoint(element, 200, 300)).toBe(true); // Bottom-right

    // Test edges
    expect(containsPoint(element, 125, 100)).toBe(true); // Top edge
    expect(containsPoint(element, 125, 300)).toBe(true); // Bottom edge
    expect(containsPoint(element, 50, 200)).toBe(true); // Left edge
    expect(containsPoint(element, 200, 200)).toBe(true); // Right edge
  });

  test("should return false when point is outside element boundaries", () => {
    // Test points outside each edge
    expect(containsPoint(element, 49, 200)).toBe(false); // Left
    expect(containsPoint(element, 201, 200)).toBe(false); // Right
    expect(containsPoint(element, 125, 99)).toBe(false); // Top
    expect(containsPoint(element, 125, 301)).toBe(false); // Bottom

    // Test points outside corners
    expect(containsPoint(element, 0, 0)).toBe(false); // Far top-left
    expect(containsPoint(element, 250, 0)).toBe(false); // Far top-right
    expect(containsPoint(element, 0, 400)).toBe(false); // Far bottom-left
    expect(containsPoint(element, 250, 400)).toBe(false); // Far bottom-right
  });

  test("should handle decimal coordinates", () => {
    expect(containsPoint(element, 50.5, 100.5)).toBe(true);
    expect(containsPoint(element, 49.9, 100)).toBe(false);
  });
});
