import { describe, expect, test, vi } from "vitest";
import { ensureVisible } from "../ensure-visible";

describe("ensureVisible", () => {
  test("should perform the correct result", () => {
    const cell = document.createElement("div");
    cell.setAttribute("data-ln-cell", "true");
    cell.setAttribute("data-ln-rowindex", "1");
    cell.setAttribute("data-ln-colindex", "3");
    cell.setAttribute("data-ln-rowspan", "2");
    cell.setAttribute("data-ln-colspan", "4");

    const scroll = vi.fn();

    ensureVisible(cell, scroll);
    expect(scroll.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "behavior": "instant",
            "column": 3,
            "row": 1,
          },
        ],
      ]
    `);
  });
});
