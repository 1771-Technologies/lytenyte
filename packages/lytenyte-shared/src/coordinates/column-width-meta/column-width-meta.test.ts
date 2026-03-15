import { describe, expect, test } from "vitest";
import { columnWidthMeta } from "../column-width-meta/column-width-meta.js";

describe("columnWidthMeta", () => {
  test("Should return empty widths, zero totalWidth, and zero flexTotal for empty columns", () => {
    expect(columnWidthMeta([], {})).toEqual({ widths: [], totalWidth: 0, flexTotal: 0 });
  });

  test("Should use the column explicit width when provided", () => {
    const { widths, totalWidth } = columnWidthMeta([{ id: "a", width: 300 }], {});
    expect(widths[0]).toBe(300);
    expect(totalWidth).toBe(300);
  });

  test("Should use base width when column does not specify a width", () => {
    const { widths } = columnWidthMeta([{ id: "a" }], { width: 150 });
    expect(widths[0]).toBe(150);
  });

  test("Should use the hardcoded default width of 200 when neither column nor base specifies a width", () => {
    const { widths } = columnWidthMeta([{ id: "a" }], {});
    expect(widths[0]).toBe(200);
  });

  test("Should clamp width up to widthMin when width is below minimum", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 50, widthMin: 100 }], {});
    expect(widths[0]).toBe(100);
  });

  test("Should clamp width down to widthMax when width is above maximum", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 500, widthMax: 300 }], {});
    expect(widths[0]).toBe(300);
  });

  test("Should leave width unchanged when it is within min/max range", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 200, widthMin: 100, widthMax: 300 }], {});
    expect(widths[0]).toBe(200);
  });

  test("Should use column widthMin and widthMax over base widthMin and widthMax", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 50, widthMin: 120, widthMax: 400 }], {
      widthMin: 10,
      widthMax: 200,
    });
    expect(widths[0]).toBe(120);
  });

  test("Should apply base widthMin when column does not specify one", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 50 }], { widthMin: 100 });
    expect(widths[0]).toBe(100);
  });

  test("Should apply base widthMax when column does not specify one", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 500 }], { widthMax: 300 });
    expect(widths[0]).toBe(300);
  });

  test("Should use the hardcoded default widthMin of 80 when neither column nor base specifies one", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 50 }], {});
    expect(widths[0]).toBe(80);
  });

  test("Should use the hardcoded default widthMax of 1000 when neither column nor base specifies one", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 1200 }], {});
    expect(widths[0]).toBe(1000);
  });

  test("Should resolve to widthMax when widthMin is greater than widthMax", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 200, widthMin: 300, widthMax: 100 }], {});
    expect(widths[0]).toBe(100);
  });

  test("Should produce a zero width when the clamped result is negative", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: -50, widthMin: -200, widthMax: -10 }], {});
    expect(widths[0]).toBe(0);
  });

  test("Should allow a zero width when widthMin is 0 and width is 0", () => {
    const { widths } = columnWidthMeta([{ id: "a", width: 0, widthMin: 0 }], {});
    expect(widths[0]).toBe(0);
  });

  test("Should add a positive widthFlex to flexTotal", () => {
    const { flexTotal } = columnWidthMeta([{ id: "a", widthFlex: 2 }], {});
    expect(flexTotal).toBe(2);
  });

  test("Should not add a zero widthFlex to flexTotal", () => {
    const { flexTotal } = columnWidthMeta([{ id: "a", widthFlex: 0 }], {});
    expect(flexTotal).toBe(0);
  });

  test("Should treat a negative widthFlex as zero and not add it to flexTotal", () => {
    const { flexTotal } = columnWidthMeta([{ id: "a", widthFlex: -5 }], {});
    expect(flexTotal).toBe(0);
  });

  test("Should apply base widthFlex to columns that do not specify their own", () => {
    const { flexTotal } = columnWidthMeta([{ id: "a" }, { id: "b" }], { widthFlex: 1 });
    expect(flexTotal).toBe(2);
  });

  test("Should treat a negative base widthFlex as zero", () => {
    const { flexTotal } = columnWidthMeta([{ id: "a" }], { widthFlex: -3 });
    expect(flexTotal).toBe(0);
  });

  test("Should sum flex values correctly across multiple flex columns", () => {
    const { flexTotal } = columnWidthMeta(
      [
        { id: "a", widthFlex: 1 },
        { id: "b", widthFlex: 2 },
        { id: "c", widthFlex: 3 },
      ],
      {},
    );
    expect(flexTotal).toBe(6);
  });

  test("Should sum totalWidth across all computed column widths", () => {
    const { totalWidth } = columnWidthMeta(
      [
        { id: "a", width: 100 },
        { id: "b", width: 200 },
        { id: "c", width: 300 },
      ],
      {},
    );
    expect(totalWidth).toBe(600);
  });

  test("Should produce a widths array with the same length as the columns array", () => {
    const { widths } = columnWidthMeta([{ id: "a" }, { id: "b" }, { id: "c" }], {});
    expect(widths.length).toBe(3);
  });

  test("Should preserve column order in the widths array", () => {
    const { widths } = columnWidthMeta(
      [
        { id: "a", width: 100 },
        { id: "b", width: 200 },
        { id: "c", width: 300 },
      ],
      {},
    );
    expect(widths).toEqual([100, 200, 300]);
  });

  test("Should resolve each column width independently using its own and base properties", () => {
    const { widths } = columnWidthMeta(
      [{ id: "a", width: 150 }, { id: "b" }, { id: "c", width: 50, widthMin: 90 }],
      { width: 250 },
    );
    expect(widths).toEqual([150, 250, 90]);
  });
});
