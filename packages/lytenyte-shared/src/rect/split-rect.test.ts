import { describe, expect, test } from "vitest";
import { splitRect } from "./split-rect.js";
import type { DataRect, SectionedRect } from "./types.js";

function findSection(result: SectionedRect[], section: SectionedRect["section"]) {
  return result.find((r) => r.section === section);
}

describe("splitRect", () => {
  const rect: DataRect = {
    columnStart: 0,
    columnEnd: 12,
    rowStart: 0,
    rowEnd: 9,
  };

  test("Should split a rect into 9 sections when cutoffs are inside bounds", () => {
    const result = splitRect(rect, 3, 9, 2, 6);

    expect(result).toHaveLength(9);

    expect(findSection(result, "top-start")).toEqual({
      columnStart: 0,
      columnEnd: 3,
      rowStart: 0,
      rowEnd: 2,
      section: "top-start",
    });

    expect(findSection(result, "top-center")).toEqual({
      columnStart: 3,
      columnEnd: 9,
      rowStart: 0,
      rowEnd: 2,
      section: "top-center",
    });

    expect(findSection(result, "top-end")).toEqual({
      columnStart: 9,
      columnEnd: 12,
      rowStart: 0,
      rowEnd: 2,
      section: "top-end",
    });

    expect(findSection(result, "center-start")).toEqual({
      columnStart: 0,
      columnEnd: 3,
      rowStart: 2,
      rowEnd: 6,
      section: "center-start",
    });

    expect(findSection(result, "center-center")).toEqual({
      columnStart: 3,
      columnEnd: 9,
      rowStart: 2,
      rowEnd: 6,
      section: "center-center",
    });

    expect(findSection(result, "center-end")).toEqual({
      columnStart: 9,
      columnEnd: 12,
      rowStart: 2,
      rowEnd: 6,
      section: "center-end",
    });

    expect(findSection(result, "bottom-start")).toEqual({
      columnStart: 0,
      columnEnd: 3,
      rowStart: 6,
      rowEnd: 9,
      section: "bottom-start",
    });

    expect(findSection(result, "bottom-center")).toEqual({
      columnStart: 3,
      columnEnd: 9,
      rowStart: 6,
      rowEnd: 9,
      section: "bottom-center",
    });

    expect(findSection(result, "bottom-end")).toEqual({
      columnStart: 9,
      columnEnd: 12,
      rowStart: 6,
      rowEnd: 9,
      section: "bottom-end",
    });
  });

  test("Should omit start column sections when startCutoff is at columnStart", () => {
    const result = splitRect(rect, 0, 9, 2, 6);

    expect(findSection(result, "top-start")).toBeUndefined();
    expect(findSection(result, "center-start")).toBeUndefined();
    expect(findSection(result, "bottom-start")).toBeUndefined();
    expect(result).toHaveLength(6);
  });

  test("Should omit end column sections when endCutoff is at columnEnd", () => {
    const result = splitRect(rect, 3, 12, 2, 6);

    expect(findSection(result, "top-end")).toBeUndefined();
    expect(findSection(result, "center-end")).toBeUndefined();
    expect(findSection(result, "bottom-end")).toBeUndefined();
    expect(result).toHaveLength(6);
  });

  test("Should omit top row sections when topCutoff is at rowStart", () => {
    const result = splitRect(rect, 3, 9, 0, 6);

    expect(findSection(result, "top-start")).toBeUndefined();
    expect(findSection(result, "top-center")).toBeUndefined();
    expect(findSection(result, "top-end")).toBeUndefined();
    expect(result).toHaveLength(6);
  });

  test("Should omit bottom row sections when bottomCutoff is at rowEnd", () => {
    const result = splitRect(rect, 3, 9, 2, 9);

    expect(findSection(result, "bottom-start")).toBeUndefined();
    expect(findSection(result, "bottom-center")).toBeUndefined();
    expect(findSection(result, "bottom-end")).toBeUndefined();
    expect(result).toHaveLength(6);
  });

  test("Should return only center-center when all cutoffs match rect edges", () => {
    const result = splitRect(rect, 0, 12, 0, 9);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      columnStart: 0,
      columnEnd: 12,
      rowStart: 0,
      rowEnd: 9,
      section: "center-center",
    });
  });

  test("Should clamp cutoffs that exceed rect bounds", () => {
    const result = splitRect(rect, -5, 20, -3, 15);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      columnStart: 0,
      columnEnd: 12,
      rowStart: 0,
      rowEnd: 9,
      section: "center-center",
    });
  });

  test("Should handle startCutoff equal to endCutoff (no center column)", () => {
    const result = splitRect(rect, 6, 6, 2, 6);

    expect(findSection(result, "top-center")).toBeUndefined();
    expect(findSection(result, "center-center")).toBeUndefined();
    expect(findSection(result, "bottom-center")).toBeUndefined();

    expect(findSection(result, "top-start")).toEqual({
      columnStart: 0,
      columnEnd: 6,
      rowStart: 0,
      rowEnd: 2,
      section: "top-start",
    });
    expect(findSection(result, "top-end")).toEqual({
      columnStart: 6,
      columnEnd: 12,
      rowStart: 0,
      rowEnd: 2,
      section: "top-end",
    });
  });

  test("Should handle topCutoff equal to bottomCutoff (no center row)", () => {
    const result = splitRect(rect, 3, 9, 4, 4);

    expect(findSection(result, "center-start")).toBeUndefined();
    expect(findSection(result, "center-center")).toBeUndefined();
    expect(findSection(result, "center-end")).toBeUndefined();

    expect(findSection(result, "top-start")).toEqual({
      columnStart: 0,
      columnEnd: 3,
      rowStart: 0,
      rowEnd: 4,
      section: "top-start",
    });
    expect(findSection(result, "bottom-end")).toEqual({
      columnStart: 9,
      columnEnd: 12,
      rowStart: 4,
      rowEnd: 9,
      section: "bottom-end",
    });
  });

  test("Should handle a rect with non-zero origin", () => {
    const offsetRect: DataRect = {
      columnStart: 5,
      columnEnd: 15,
      rowStart: 10,
      rowEnd: 20,
    };

    const result = splitRect(offsetRect, 8, 12, 13, 17);

    expect(result).toHaveLength(9);

    expect(findSection(result, "top-start")).toEqual({
      columnStart: 5,
      columnEnd: 8,
      rowStart: 10,
      rowEnd: 13,
      section: "top-start",
    });

    expect(findSection(result, "center-center")).toEqual({
      columnStart: 8,
      columnEnd: 12,
      rowStart: 13,
      rowEnd: 17,
      section: "center-center",
    });

    expect(findSection(result, "bottom-end")).toEqual({
      columnStart: 12,
      columnEnd: 15,
      rowStart: 17,
      rowEnd: 20,
      section: "bottom-end",
    });
  });

  test("Should return a single section for a 1x1 rect", () => {
    const tinyRect: DataRect = {
      columnStart: 3,
      columnEnd: 4,
      rowStart: 5,
      rowEnd: 6,
    };

    const result = splitRect(tinyRect, 3, 4, 5, 6);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      columnStart: 3,
      columnEnd: 4,
      rowStart: 5,
      rowEnd: 6,
      section: "center-center",
    });
  });

  test("Should return empty array for a zero-area rect", () => {
    const zeroRect: DataRect = {
      columnStart: 5,
      columnEnd: 5,
      rowStart: 3,
      rowEnd: 3,
    };

    const result = splitRect(zeroRect, 2, 8, 1, 6);
    expect(result).toHaveLength(0);
  });

  test("Should cover all area of the original rect without gaps or overlaps", () => {
    const result = splitRect(rect, 4, 8, 3, 7);

    const totalArea = result.reduce(
      (sum, r) => sum + (r.columnEnd - r.columnStart) * (r.rowEnd - r.rowStart),
      0,
    );

    const rectArea = (rect.columnEnd - rect.columnStart) * (rect.rowEnd - rect.rowStart);

    expect(totalArea).toBe(rectArea);
  });

  test("Should produce no overlapping sections", () => {
    const result = splitRect(rect, 3, 9, 2, 6);

    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];

        const overlapsCol = a.columnStart < b.columnEnd && b.columnStart < a.columnEnd;
        const overlapsRow = a.rowStart < b.rowEnd && b.rowStart < a.rowEnd;

        expect(overlapsCol && overlapsRow).toBe(false);
      }
    }
  });
});
