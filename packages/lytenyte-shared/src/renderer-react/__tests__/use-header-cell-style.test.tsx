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
        "position": "relative",
        "transform": "translate3d(0px, 0px, 0px)",
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
        "left": 0,
        "position": "sticky",
        "transform": "translate3d(0px, 0px, 0px)",
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
        "left": 0,
        "position": "sticky",
        "transform": "translate3d(700px, 0px, 0px)",
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
        "position": "relative",
        "transform": "translate3d(0px, 0px, 0px)",
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
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(0px, 0px, 0px)",
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
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(-700px, 0px, 0px)",
        "zIndex": 11,
      }
    `);
  });
});
