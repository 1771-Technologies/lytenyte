import { describe, expect, test } from "vitest";
import { deselectRect } from "./deselect-rect.js";
import type { DataRect } from "../types.js";

describe("deselectRect", () => {
  const rect: DataRect = {
    columnStart: 0,
    columnEnd: 12,
    rowStart: 0,
    rowEnd: 9,
  };

  test("Should return 8 rects when deselection is fully inside", () => {
    const deselection: DataRect = {
      columnStart: 3,
      columnEnd: 9,
      rowStart: 2,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(8);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 3, rowStart: 0, rowEnd: 2 },
      { columnStart: 3, columnEnd: 9, rowStart: 0, rowEnd: 2 },
      { columnStart: 9, columnEnd: 12, rowStart: 0, rowEnd: 2 },
      { columnStart: 0, columnEnd: 3, rowStart: 2, rowEnd: 6 },
      { columnStart: 9, columnEnd: 12, rowStart: 2, rowEnd: 6 },
      { columnStart: 0, columnEnd: 3, rowStart: 6, rowEnd: 9 },
      { columnStart: 3, columnEnd: 9, rowStart: 6, rowEnd: 9 },
      { columnStart: 9, columnEnd: 12, rowStart: 6, rowEnd: 9 },
    ]);
  });

  test("Should return original rect when deselection is completely outside", () => {
    const deselection: DataRect = {
      columnStart: 20,
      columnEnd: 25,
      rowStart: 20,
      rowEnd: 25,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(rect);
  });

  test("Should return empty array when deselection covers the entire rect", () => {
    const result = deselectRect(rect, rect);
    expect(result).toHaveLength(0);
  });

  test("Should return empty array when deselection exceeds the rect", () => {
    const deselection: DataRect = {
      columnStart: -5,
      columnEnd: 20,
      rowStart: -5,
      rowEnd: 20,
    };

    const result = deselectRect(rect, deselection);
    expect(result).toHaveLength(0);
  });

  test("Should handle deselection along the top edge", () => {
    const deselection: DataRect = {
      columnStart: 3,
      columnEnd: 9,
      rowStart: 0,
      rowEnd: 4,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(5);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 3, rowStart: 0, rowEnd: 4 },
      { columnStart: 9, columnEnd: 12, rowStart: 0, rowEnd: 4 },
      { columnStart: 0, columnEnd: 3, rowStart: 4, rowEnd: 9 },
      { columnStart: 3, columnEnd: 9, rowStart: 4, rowEnd: 9 },
      { columnStart: 9, columnEnd: 12, rowStart: 4, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection along the bottom edge", () => {
    const deselection: DataRect = {
      columnStart: 3,
      columnEnd: 9,
      rowStart: 5,
      rowEnd: 9,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(5);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 3, rowStart: 0, rowEnd: 5 },
      { columnStart: 3, columnEnd: 9, rowStart: 0, rowEnd: 5 },
      { columnStart: 9, columnEnd: 12, rowStart: 0, rowEnd: 5 },
      { columnStart: 0, columnEnd: 3, rowStart: 5, rowEnd: 9 },
      { columnStart: 9, columnEnd: 12, rowStart: 5, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection along the left edge", () => {
    const deselection: DataRect = {
      columnStart: 0,
      columnEnd: 4,
      rowStart: 3,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(5);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 4, rowStart: 0, rowEnd: 3 },
      { columnStart: 4, columnEnd: 12, rowStart: 0, rowEnd: 3 },
      { columnStart: 4, columnEnd: 12, rowStart: 3, rowEnd: 6 },
      { columnStart: 0, columnEnd: 4, rowStart: 6, rowEnd: 9 },
      { columnStart: 4, columnEnd: 12, rowStart: 6, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection along the right edge", () => {
    const deselection: DataRect = {
      columnStart: 8,
      columnEnd: 12,
      rowStart: 3,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(5);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 8, rowStart: 0, rowEnd: 3 },
      { columnStart: 8, columnEnd: 12, rowStart: 0, rowEnd: 3 },
      { columnStart: 0, columnEnd: 8, rowStart: 3, rowEnd: 6 },
      { columnStart: 0, columnEnd: 8, rowStart: 6, rowEnd: 9 },
      { columnStart: 8, columnEnd: 12, rowStart: 6, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection in a corner", () => {
    const deselection: DataRect = {
      columnStart: 0,
      columnEnd: 4,
      rowStart: 0,
      rowEnd: 3,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { columnStart: 4, columnEnd: 12, rowStart: 0, rowEnd: 3 },
      { columnStart: 0, columnEnd: 4, rowStart: 3, rowEnd: 9 },
      { columnStart: 4, columnEnd: 12, rowStart: 3, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection that partially overlaps", () => {
    const deselection: DataRect = {
      columnStart: 8,
      columnEnd: 20,
      rowStart: 5,
      rowEnd: 20,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 8, rowStart: 0, rowEnd: 5 },
      { columnStart: 8, columnEnd: 12, rowStart: 0, rowEnd: 5 },
      { columnStart: 0, columnEnd: 8, rowStart: 5, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection spanning full width", () => {
    const deselection: DataRect = {
      columnStart: 0,
      columnEnd: 12,
      rowStart: 3,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 12, rowStart: 0, rowEnd: 3 },
      { columnStart: 0, columnEnd: 12, rowStart: 6, rowEnd: 9 },
    ]);
  });

  test("Should handle deselection spanning full height", () => {
    const deselection: DataRect = {
      columnStart: 4,
      columnEnd: 8,
      rowStart: 0,
      rowEnd: 9,
    };

    const result = deselectRect(rect, deselection);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { columnStart: 0, columnEnd: 4, rowStart: 0, rowEnd: 9 },
      { columnStart: 8, columnEnd: 12, rowStart: 0, rowEnd: 9 },
    ]);
  });

  test("Should not include the section property in returned rects", () => {
    const deselection: DataRect = {
      columnStart: 3,
      columnEnd: 9,
      rowStart: 2,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    for (const r of result) {
      expect(r).not.toHaveProperty("section");
    }
  });

  test("Should preserve total area minus deselection intersection", () => {
    const deselection: DataRect = {
      columnStart: 3,
      columnEnd: 9,
      rowStart: 2,
      rowEnd: 6,
    };

    const result = deselectRect(rect, deselection);

    const remainingArea = result.reduce(
      (sum, r) => sum + (r.columnEnd - r.columnStart) * (r.rowEnd - r.rowStart),
      0,
    );

    const rectArea = (rect.columnEnd - rect.columnStart) * (rect.rowEnd - rect.rowStart);
    const deselectionArea =
      (deselection.columnEnd - deselection.columnStart) * (deselection.rowEnd - deselection.rowStart);

    expect(remainingArea).toBe(rectArea - deselectionArea);
  });
});
