import { describe, expect, test } from "vitest";
import { getRowsInSection } from "../get-rows-in-section";

describe("getRowsInSection", () => {
  test("should return the correct result", () => {
    const section = document.createElement("div");
    const row1 = document.createElement("div");
    row1.setAttribute("data-ln-row", "true");
    row1.setAttribute("data-ln-gridid", "x");
    const row2 = document.createElement("div");
    row2.setAttribute("data-ln-row", "true");
    row2.setAttribute("data-ln-gridid", "x");
    const row3 = document.createElement("div");
    row3.setAttribute("data-ln-row", "true");
    row3.setAttribute("data-ln-gridid", "x");

    section.appendChild(row1);
    section.appendChild(row2);
    section.appendChild(row3);

    expect(getRowsInSection(section, "x")).toEqual([row1, row2, row3]);
  });
});
