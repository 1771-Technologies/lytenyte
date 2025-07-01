import { describe, expect, test } from "vitest";
import type { SpanLayout } from "../../../../lytenyte-shared/src/+types.layout.js";
import { areLayoutsEqual } from "../are-layouts-equal.js";

// Create a base layout for testing
const baseLayout: SpanLayout = {
  rowTopStart: 0,
  rowTopEnd: 2,
  rowCenterStart: 2,
  rowCenterLast: 9,
  rowCenterEnd: 10,
  rowBotStart: 10,
  rowBotEnd: 12,
  colStartStart: 0,
  colStartEnd: 2,
  colCenterStart: 2,
  colCenterEnd: 8,
  colCenterLast: 7,
  colEndStart: 8,
  colEndEnd: 10,
};

describe("areLayoutsEqual", () => {
  test("should return true when layouts are identical", () => {
    // Create a copy of baseLayout
    const identicalLayout: SpanLayout = { ...baseLayout };

    expect(areLayoutsEqual(baseLayout, identicalLayout)).toBe(true);
  });

  test("should return false when rowTopStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowTopStart: 1,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowTopEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowTopEnd: 3,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowCenterStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowCenterStart: 3,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowCenterLast differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowCenterLast: 8,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowCenterEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowCenterEnd: 11,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowBotStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowBotStart: 11,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when rowBotEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      rowBotEnd: 13,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colStartStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colStartStart: 1,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colStartEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colStartEnd: 3,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colCenterStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colCenterStart: 3,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colCenterEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colCenterEnd: 9,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colCenterLast differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colCenterLast: 6,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colEndStart differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colEndStart: 9,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });

  test("should return false when colEndEnd differs", () => {
    const modifiedLayout: SpanLayout = {
      ...baseLayout,
      colEndEnd: 11,
    };

    expect(areLayoutsEqual(baseLayout, modifiedLayout)).toBe(false);
  });
});
