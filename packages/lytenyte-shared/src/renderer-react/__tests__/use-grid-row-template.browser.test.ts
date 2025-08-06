import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useGridRowTemplate } from "../use-grid-row-template";

describe("useGridRowTemplate", () => {
  test("returns the correct template string when floating rows are not enabled", () => {
    const result = renderHook(() => {
      return useGridRowTemplate(2, 20, 30, 30, false);
    });

    expect(result.result).toMatchInlineSnapshot(`
      {
        "current": "20px 30px",
      }
    `);
  });
  test("returns the correct template string when floating rows are enabled", () => {
    const result = renderHook(() => {
      return useGridRowTemplate(2, 20, 30, 30, true);
    });

    expect(result.result).toMatchInlineSnapshot(`
      {
        "current": "20px 30px 30px",
      }
    `);
  });
});
