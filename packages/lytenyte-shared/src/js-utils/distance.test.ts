import { describe, expect, test } from "vitest";
import { distance } from "./distance.js";

describe("distance", () => {
  test("Should return 0 when both points are the same", () => {
    expect(distance(0, 0, 0, 0)).toBe(0);
    expect(distance(5, 5, 5, 5)).toBe(0);
  });

  test("Should return correct value for horizontal distance", () => {
    expect(distance(0, 0, 3, 0)).toBe(3);
    expect(distance(10, 0, 4, 0)).toBe(6);
  });

  test("Should return correct value for vertical distance", () => {
    expect(distance(0, 0, 0, 5)).toBe(5);
    expect(distance(2, 10, 2, 4)).toBe(6);
  });

  test("Should return correct diagonal distance", () => {
    expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
    expect(distance(-1, -1, 2, 3)).toBeCloseTo(5);
  });

  test("Should handle negative coordinates", () => {
    expect(distance(-3, -4, 0, 0)).toBe(5);
    expect(distance(-2, -2, -5, -6)).toBe(5);
  });
});
