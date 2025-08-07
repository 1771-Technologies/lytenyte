import { describe, expect, test } from "vitest";
import { getRowQuery } from "../get-row-query.js";

describe("getRowQuery", () => {
  test("should return the correct result", () => {
    const query = getRowQuery("x", 2);

    expect(query).toMatchInlineSnapshot(
      `"[data-ln-row][data-ln-gridid="x"][data-ln-rowindex="2"]"`,
    );

    const container = document.createElement("div");
    const row = document.createElement("div");
    row.setAttribute("data-ln-row", "true");
    row.setAttribute("data-ln-gridid", "x");
    row.setAttribute("data-ln-rowindex", "2");

    const row2 = document.createElement("div");
    row2.setAttribute("data-ln-row", "true");
    row2.setAttribute("data-ln-gridid", "x");
    row2.setAttribute("data-ln-rowindex", "3");

    container.appendChild(row);
    container.appendChild(row2);

    expect(container.querySelector(query)).toEqual(row);
  });
});
