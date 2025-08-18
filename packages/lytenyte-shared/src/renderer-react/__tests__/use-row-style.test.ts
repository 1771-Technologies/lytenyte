import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useRowStyle } from "../use-row-style.js";

describe("useRowStyle", () => {
  test("should return the correct styles", () => {
    const result = renderHook(() => {
      return useRowStyle(
        new Uint32Array([0, 100, 200, 300]),
        1,
        false,
        { background: "red" },
        undefined,
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "background": "red",
        "boxSizing": "border-box",
        "display": "grid",
        "gridTemplateColumns": "100%",
        "gridTemplateRows": "100px",
        "height": 100,
        "minWidth": "var(--lng-viewport-width)",
        "opacity": undefined,
        "pointerEvents": "none",
        "width": "var(--lng-scroll-container-width)",
      }
    `);
  });

  test("should return the correct styles with focus", () => {
    const result = renderHook(() => {
      return useRowStyle(
        new Uint32Array([0, 100, 200, 300]),
        1,
        true,
        { background: "red" },
        { width: "2px" },
      );
    });

    expect(result.result.current).toMatchInlineSnapshot(`
      {
        "background": "red",
        "boxSizing": "border-box",
        "display": "grid",
        "gridTemplateColumns": "100%",
        "gridTemplateRows": "100px",
        "height": 100,
        "minWidth": "var(--lng-viewport-width)",
        "opacity": "0",
        "pointerEvents": "none",
        "width": "2px",
      }
    `);
  });
});
