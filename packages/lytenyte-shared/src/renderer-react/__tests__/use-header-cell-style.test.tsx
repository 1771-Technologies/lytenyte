import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useHeaderCellStyle } from "../use-header-cell-style.js";

describe("useHeaderCellStyle", () => {
  test("returns the correct styles for the given cells", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: null, colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        false,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "1",
        "overflow": "hidden",
        "position": "relative",
      }
    `);
  });

  test("returns the correct styles for the given cells with pin start", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: "start", colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        false,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "1",
        "insetInlineStart": "0px",
        "overflow": "hidden",
        "position": "sticky",
        "zIndex": 11,
      }
    `);
  });

  test("returns the correct styles for the given cells with pin end", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: "end", colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        false,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "2",
        "insetInlineEnd": "200px",
        "overflow": "hidden",
        "position": "sticky",
        "zIndex": 11,
      }
    `);
  });

  test("returns the correct styles for the given cells with rtl", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: null, colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        true,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "1",
        "overflow": "hidden",
        "position": "relative",
      }
    `);
  });

  test("returns the correct styles for the given cells with rtl", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: "start", colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        true,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "1",
        "insetInlineStart": "0px",
        "overflow": "hidden",
        "position": "sticky",
        "zIndex": 11,
      }
    `);
  });

  test("returns the correct styles for the given cells with rtl", () => {
    const result = renderHook(() => {
      return useHeaderCellStyle(
        { rowStart: 0, rowEnd: 0, colStart: 0, colEnd: 1, colPin: "end", colSpan: 1 },
        new Uint32Array([0, 100, 200, 300]),
        true,
        1000,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "gridColumnStart": "2",
        "insetInlineEnd": "200px",
        "overflow": "hidden",
        "position": "sticky",
        "zIndex": 11,
      }
    `);
  });
});
