import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useCellStyle } from "../use-cell-style.js";

describe("useCellStyle", () => {
  test("should return the correct result", () => {
    const { result } = renderHook(() => {
      return useCellStyle(
        new Uint32Array([0, 100, 200, 300]),
        new Uint32Array([0, 100, 200, 300]),
        { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1 },
        true,
        0,
        1000,
        undefined,
      );
    });
    expect(result.current).toMatchInlineSnapshot(`
      {
        "boxSizing": "border-box",
        "gridColumnEnd": "2",
        "gridColumnStart": "1",
        "gridRowEnd": "2",
        "gridRowStart": "1",
        "height": 100,
        "maxWidth": 100,
        "minWidth": 100,
        "pointerEvents": "all",
        "transform": "translate3d(0px, 0px, 0px)",
        "width": 100,
      }
    `);
  });

  test("should return the correct result with pins", () => {
    const { result } = renderHook(() => {
      return useCellStyle(
        new Uint32Array([0, 100, 200, 300]),
        new Uint32Array([0, 100, 200, 300]),
        { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1, colPin: "start", rowPin: "top" },
        true,
        0,
        1000,
        undefined,
      );
    });
    expect(result.current).toMatchInlineSnapshot(`
      {
        "boxSizing": "border-box",
        "gridColumnEnd": "2",
        "gridColumnStart": "1",
        "gridRowEnd": "2",
        "gridRowStart": "1",
        "height": 100,
        "maxWidth": 100,
        "minWidth": 100,
        "pointerEvents": "all",
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(0px, 0px, 0px)",
        "width": 100,
        "zIndex": 5,
      }
    `);
  });

  test("should return the correct result with pins end", () => {
    const { result } = renderHook(() => {
      return useCellStyle(
        new Uint32Array([0, 100, 200, 300]),
        new Uint32Array([0, 100, 200, 300]),
        { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1, colPin: "end", rowPin: "bottom" },
        true,
        0,
        1000,
        undefined,
      );
    });
    expect(result.current).toMatchInlineSnapshot(`
      {
        "boxSizing": "border-box",
        "gridColumnEnd": "2",
        "gridColumnStart": "1",
        "gridRowEnd": "2",
        "gridRowStart": "1",
        "height": 100,
        "maxWidth": 100,
        "minWidth": 100,
        "pointerEvents": "all",
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(-700px, 0px, 0px)",
        "width": 100,
        "zIndex": 5,
      }
    `);
  });

  test("should return the correct result with pins no row pin", () => {
    const { result } = renderHook(() => {
      return useCellStyle(
        new Uint32Array([0, 100, 200, 300]),
        new Uint32Array([0, 100, 200, 300]),
        { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1, colPin: "end" },
        true,
        0,
        1000,
        undefined,
      );
    });
    expect(result.current).toMatchInlineSnapshot(`
      {
        "boxSizing": "border-box",
        "gridColumnEnd": "2",
        "gridColumnStart": "1",
        "gridRowEnd": "2",
        "gridRowStart": "1",
        "height": 100,
        "maxWidth": 100,
        "minWidth": 100,
        "pointerEvents": "all",
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(-700px, 0px, 0px)",
        "width": 100,
        "zIndex": 2,
      }
    `);
  });

  test("should add additional styles", () => {
    const { result } = renderHook(() => {
      return useCellStyle(
        new Uint32Array([0, 100, 200, 300]),
        new Uint32Array([0, 100, 200, 300]),
        { colIndex: 0, rowIndex: 0, colSpan: 1, rowSpan: 1, colPin: "end" },
        true,
        0,
        1000,
        { backdropFilter: "initial" },
      );
    });
    expect(result.current).toMatchInlineSnapshot(`
      {
        "backdropFilter": "initial",
        "boxSizing": "border-box",
        "gridColumnEnd": "2",
        "gridColumnStart": "1",
        "gridRowEnd": "2",
        "gridRowStart": "1",
        "height": 100,
        "maxWidth": 100,
        "minWidth": 100,
        "pointerEvents": "all",
        "position": "sticky",
        "right": 0,
        "transform": "translate3d(-700px, 0px, 0px)",
        "width": 100,
        "zIndex": 2,
      }
    `);
  });
});
