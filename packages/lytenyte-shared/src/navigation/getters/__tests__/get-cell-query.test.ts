import { describe, expect, test } from "vitest";
import { getCellQuery } from "../get-cell-query.js";

describe("getCellQuery", () => {
  test("should return the correct result", () => {
    const query = getCellQuery("x", 2, 3);

    expect(query).toMatchInlineSnapshot(
      `"[data-ln-row][data-ln-gridid="x"] [data-ln-cell][data-ln-rowindex="2"][data-ln-colindex="3"]"`,
    );

    const container = document.createElement("div");
    const row = document.createElement("div");
    row.setAttribute("data-ln-row", "true");
    row.setAttribute("data-ln-gridid", "x");

    const group = document.createElement("div");
    const cell1 = document.createElement("div");
    const cell2 = document.createElement("div");
    cell1.setAttribute("data-ln-cell", "true");
    cell2.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "2");
    cell1.setAttribute("data-ln-colindex", "3");
    cell2.setAttribute("data-ln-rowindex", "3");
    cell2.setAttribute("data-ln-colindex", "3");

    group.append(cell1);
    group.append(cell2);

    row.append(group);
    container.append(row);

    expect(container.querySelector(query)).toEqual(cell1);
  });
});
