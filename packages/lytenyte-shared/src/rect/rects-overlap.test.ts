import { describe, expect, test } from "vitest";
import { rectsOverlap } from "./rects-overlap.js";
import type { DataRect } from "./types";

describe("rectsOverlap", () => {
  const rect: DataRect = {
    columnStart: 2,
    columnEnd: 8,
    rowStart: 3,
    rowEnd: 7,
  };

  test("Should return true when one rect is fully inside the other", () => {
    const inner: DataRect = { columnStart: 3, columnEnd: 6, rowStart: 4, rowEnd: 6 };
    expect(rectsOverlap(rect, inner)).toBe(true);
    expect(rectsOverlap(inner, rect)).toBe(true);
  });

  test("Should return true when rects partially overlap", () => {
    const other: DataRect = { columnStart: 5, columnEnd: 10, rowStart: 5, rowEnd: 9 };
    expect(rectsOverlap(rect, other)).toBe(true);
    expect(rectsOverlap(other, rect)).toBe(true);
  });

  test("Should return true when rects are identical", () => {
    expect(rectsOverlap(rect, rect)).toBe(true);
  });

  test("Should return false when rects are separated horizontally", () => {
    const right: DataRect = { columnStart: 10, columnEnd: 15, rowStart: 3, rowEnd: 7 };
    expect(rectsOverlap(rect, right)).toBe(false);
    expect(rectsOverlap(right, rect)).toBe(false);
  });

  test("Should return false when rects are separated vertically", () => {
    const below: DataRect = { columnStart: 2, columnEnd: 8, rowStart: 10, rowEnd: 14 };
    expect(rectsOverlap(rect, below)).toBe(false);
    expect(rectsOverlap(below, rect)).toBe(false);
  });

  test("Should return false when rects share a column edge (end-exclusive)", () => {
    const adjacent: DataRect = { columnStart: 8, columnEnd: 12, rowStart: 3, rowEnd: 7 };
    expect(rectsOverlap(rect, adjacent)).toBe(false);
    expect(rectsOverlap(adjacent, rect)).toBe(false);
  });

  test("Should return false when rects share a row edge (end-exclusive)", () => {
    const adjacent: DataRect = { columnStart: 2, columnEnd: 8, rowStart: 7, rowEnd: 10 };
    expect(rectsOverlap(rect, adjacent)).toBe(false);
    expect(rectsOverlap(adjacent, rect)).toBe(false);
  });

  test("Should return false when rects touch at a corner (end-exclusive)", () => {
    const diagonal: DataRect = { columnStart: 8, columnEnd: 12, rowStart: 7, rowEnd: 10 };
    expect(rectsOverlap(rect, diagonal)).toBe(false);
    expect(rectsOverlap(diagonal, rect)).toBe(false);
  });

  test("Should return false when both rects have zero area", () => {
    const a: DataRect = { columnStart: 4, columnEnd: 4, rowStart: 5, rowEnd: 5 };
    const b: DataRect = { columnStart: 4, columnEnd: 4, rowStart: 5, rowEnd: 5 };
    expect(rectsOverlap(a, b)).toBe(false);
  });

  test("Should return false when a zero-area rect is outside the other", () => {
    const zeroWidth: DataRect = { columnStart: 10, columnEnd: 10, rowStart: 3, rowEnd: 7 };
    expect(rectsOverlap(rect, zeroWidth)).toBe(false);
  });

  test("Should return true when overlap is a single cell", () => {
    const corner: DataRect = { columnStart: 7, columnEnd: 10, rowStart: 6, rowEnd: 10 };
    expect(rectsOverlap(rect, corner)).toBe(true);
    expect(rectsOverlap(corner, rect)).toBe(true);
  });
});
