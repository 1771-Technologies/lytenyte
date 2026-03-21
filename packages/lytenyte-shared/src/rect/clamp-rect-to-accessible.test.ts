import { describe, expect, test } from "vitest";
import { clampRectToAccessible } from "./clamp-rect-to-accessible.js";
import type { DataRect } from "./types.js";

const cutoffs = { startCutoff: 2, endCutoff: 8, topCutoff: 3, bottomCutoff: 10 };
const allAccessible = { startAccessible: true, endAccessible: true, topAccessible: true, bottomAccessible: true };
const noneAccessible = { startAccessible: false, endAccessible: false, topAccessible: false, bottomAccessible: false };

describe("clampRectToAccessible", () => {
  describe("all sections accessible", () => {
    test("returns rect unchanged when all accessible", () => {
      const rect: DataRect = { columnStart: 0, columnEnd: 10, rowStart: 0, rowEnd: 15 };
      expect(clampRectToAccessible(rect, cutoffs, allAccessible)).toEqual(rect);
    });

    test("returns rect unchanged when no pins exist (all cutoffs at boundaries)", () => {
      const noPins = { startCutoff: 0, endCutoff: 10, topCutoff: 0, bottomCutoff: 15 };
      const rect: DataRect = { columnStart: 0, columnEnd: 10, rowStart: 0, rowEnd: 15 };
      expect(clampRectToAccessible(rect, noPins, allAccessible)).toEqual(rect);
    });
  });

  describe("start column not accessible", () => {
    const access = { ...allAccessible, startAccessible: false };

    test("clamps columnStart to startCutoff when rect overlaps start pins", () => {
      const rect: DataRect = { columnStart: 0, columnEnd: 6, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 2,
        columnEnd: 6,
        rowStart: 3,
        rowEnd: 8,
      });
    });

    test("returns null when rect is entirely within start pins", () => {
      const rect: DataRect = { columnStart: 0, columnEnd: 2, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toBeNull();
    });

    test("leaves rect unchanged when rect does not touch start pins", () => {
      const rect: DataRect = { columnStart: 3, columnEnd: 7, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual(rect);
    });
  });

  describe("end column not accessible", () => {
    const access = { ...allAccessible, endAccessible: false };

    test("clamps columnEnd to endCutoff when rect overlaps end pins", () => {
      const rect: DataRect = { columnStart: 4, columnEnd: 12, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 4,
        columnEnd: 8,
        rowStart: 3,
        rowEnd: 8,
      });
    });

    test("returns null when rect is entirely within end pins", () => {
      const rect: DataRect = { columnStart: 8, columnEnd: 12, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toBeNull();
    });

    test("leaves rect unchanged when rect does not touch end pins", () => {
      const rect: DataRect = { columnStart: 3, columnEnd: 7, rowStart: 3, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual(rect);
    });
  });

  describe("top row not accessible", () => {
    const access = { ...allAccessible, topAccessible: false };

    test("clamps rowStart to topCutoff when rect overlaps top pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 0, rowEnd: 8 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 2,
        columnEnd: 7,
        rowStart: 3,
        rowEnd: 8,
      });
    });

    test("returns null when rect is entirely within top pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 0, rowEnd: 3 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toBeNull();
    });

    test("leaves rect unchanged when rect does not touch top pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 4, rowEnd: 9 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual(rect);
    });
  });

  describe("bottom row not accessible", () => {
    const access = { ...allAccessible, bottomAccessible: false };

    test("clamps rowEnd to bottomCutoff when rect overlaps bottom pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 5, rowEnd: 14 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 2,
        columnEnd: 7,
        rowStart: 5,
        rowEnd: 10,
      });
    });

    test("returns null when rect is entirely within bottom pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 10, rowEnd: 14 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toBeNull();
    });

    test("leaves rect unchanged when rect does not touch bottom pins", () => {
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 4, rowEnd: 9 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual(rect);
    });
  });

  describe("multiple axes inaccessible", () => {
    test("clamps both column axes when neither start nor end is accessible", () => {
      const access = { ...allAccessible, startAccessible: false, endAccessible: false };
      const rect: DataRect = { columnStart: 0, columnEnd: 12, rowStart: 4, rowEnd: 9 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 2,
        columnEnd: 8,
        rowStart: 4,
        rowEnd: 9,
      });
    });

    test("clamps both row axes when neither top nor bottom is accessible", () => {
      const access = { ...allAccessible, topAccessible: false, bottomAccessible: false };
      const rect: DataRect = { columnStart: 2, columnEnd: 7, rowStart: 0, rowEnd: 14 };
      expect(clampRectToAccessible(rect, cutoffs, access)).toEqual({
        columnStart: 2,
        columnEnd: 7,
        rowStart: 3,
        rowEnd: 10,
      });
    });

    test("clamps all four sides when nothing is accessible", () => {
      const rect: DataRect = { columnStart: 0, columnEnd: 12, rowStart: 0, rowEnd: 14 };
      expect(clampRectToAccessible(rect, cutoffs, noneAccessible)).toEqual({
        columnStart: 2,
        columnEnd: 8,
        rowStart: 3,
        rowEnd: 10,
      });
    });

    test("returns null when nothing is accessible and rect fits only in pinned sections", () => {
      // Rect spans only column start-pin and end-pin, nothing in center
      const narrowCutoffs = { startCutoff: 5, endCutoff: 5, topCutoff: 3, bottomCutoff: 10 };
      const rect: DataRect = { columnStart: 0, columnEnd: 10, rowStart: 4, rowEnd: 8 };
      expect(clampRectToAccessible(rect, narrowCutoffs, noneAccessible)).toBeNull();
    });
  });
});
