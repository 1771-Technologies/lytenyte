import { test } from "vitest";

test("handleHorizontal should handle header-group-cell", () => {
  const viewport = document.createElement("div");
  const headerRow = document.createElement("div");
  const headerCellMiddle = document.createElement("div");
  const headerCellLeft = document.createElement("div");
  const headerCellRight = document.createElement("div");

  headerRow.appendChild(headerCellMiddle);
  headerRow.appendChild(headerCellLeft);
  headerRow.appendChild(headerCellRight);
  viewport.appendChild(headerRow);

  headerRow.setAttribute("data-ln-gridid", "x");
  headerRow.setAttribute("data-ln-header-row-0", "true");
});
