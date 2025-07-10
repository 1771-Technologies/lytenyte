import { describe, expect, test } from "vitest";
import { getHeaderRows } from "../get-header-rows";

describe("getHeaderRows", () => {
  test("should return the correct result", () => {
    const container = document.createElement("div");
    expect(getHeaderRows(container)).toEqual(null);

    const header = document.createElement("div");
    header.setAttribute("data-ln-header", "true");
    const row1 = document.createElement("div");
    row1.setAttribute("data-ln-header-row", "true");
    const row2 = document.createElement("div");
    row2.setAttribute("data-ln-header-row", "true");
    header.appendChild(row1);
    header.appendChild(row2);
    container.appendChild(header);

    expect(getHeaderRows(container)).toEqual([row1, row2]);
  });
});
