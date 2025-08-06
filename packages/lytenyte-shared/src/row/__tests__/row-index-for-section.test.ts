import { describe, expect, test } from "vitest";
import { rowIndexForSection } from "../row-index-for-section";

describe("rowIndexForSection", () => {
  test("should return the correct value when there are no pinned rows", () => {
    expect(rowIndexForSection(0, "center", 0, 0, 10)).toEqual(0);
    expect(rowIndexForSection(0, "bottom", 0, 0, 10)).toEqual(null);
    expect(rowIndexForSection(0, "top", 0, 0, 10)).toEqual(null);
    expect(rowIndexForSection(0, "flat", 0, 0, 10)).toEqual(0);

    expect(rowIndexForSection(-1, "center", 0, 0, 10)).toEqual(null);
    expect(rowIndexForSection(11, "center", 0, 0, 10)).toEqual(null);
  });

  test("should handle request rows center rows when there are pin sections", () => {
    expect(rowIndexForSection(2, "center", 2, 2, 12)).toEqual(4);
    expect(rowIndexForSection(0, "center", 2, 2, 12)).toEqual(2);
    expect(rowIndexForSection(-1, "center", 2, 2, 12)).toEqual(null);
  });

  test("should handle request rows for pins top and bottom", () => {
    expect(rowIndexForSection(0, "top", 2, 2, 10)).toEqual(0);
    expect(rowIndexForSection(4, "top", 2, 2, 10)).toEqual(null);
    expect(rowIndexForSection(1, "bottom", 2, 2, 10)).toEqual(9);
    expect(rowIndexForSection(3, "bottom", 2, 2, 10)).toEqual(null);
  });
});
