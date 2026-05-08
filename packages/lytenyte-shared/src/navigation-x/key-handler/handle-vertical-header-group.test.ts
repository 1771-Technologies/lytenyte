import { describe, expect, test } from "vitest";
import { handleVertical } from "./handle-vertical.js";

const scrollIntoView = () => {};
const done = () => {};
const cp = { get: () => null as any, set: (fn: any) => fn({}) };

describe("handleVertical", () => {
  test("Should return early if no header element exists", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-rowindex", "1");
    viewport.appendChild(cell);
    cell.focus();
    await expect.element(cell).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: {
        kind: "header-group-cell",
        colIndex: 0,
        columnStartIndex: 0,
        columnEndIndex: 2,
        hierarchyRowIndex: 1,
      },
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should return early when going up from the topmost header row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    viewport.appendChild(header);

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(cell);
    cell.focus();
    await expect.element(cell).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: {
        kind: "header-group-cell",
        colIndex: 0,
        columnStartIndex: 0,
        columnEndIndex: 2,
        hierarchyRowIndex: 0,
      },
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should navigate up and down between header group rows", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    viewport.appendChild(header);

    // Row 0: no-range cell first (covers if(!range) branch), then wrong-range, then matching cell
    const row0NoRange = document.createElement("div");
    row0NoRange.setAttribute("data-ln-gridid", "x");
    row0NoRange.setAttribute("data-ln-header-row-0", "true");
    header.appendChild(row0NoRange);

    const row0WrongRange = document.createElement("div");
    row0WrongRange.setAttribute("data-ln-gridid", "x");
    row0WrongRange.setAttribute("data-ln-header-row-0", "true");
    row0WrongRange.setAttribute("data-ln-header-range", "5,10");
    header.appendChild(row0WrongRange);

    const row0Cell = document.createElement("div");
    row0Cell.tabIndex = 0;
    row0Cell.setAttribute("data-ln-gridid", "x");
    row0Cell.setAttribute("data-ln-header-cell", "true");
    row0Cell.setAttribute("data-ln-colindex", "0");
    row0Cell.setAttribute("data-ln-rowindex", "0");
    row0Cell.setAttribute("data-ln-header-row-0", "true");
    row0Cell.setAttribute("data-ln-header-range", "0,3");
    header.appendChild(row0Cell);

    // Row 1: same pattern for going down
    const row1NoRange = document.createElement("div");
    row1NoRange.setAttribute("data-ln-gridid", "x");
    row1NoRange.setAttribute("data-ln-header-row-1", "true");
    header.appendChild(row1NoRange);

    const row1WrongRange = document.createElement("div");
    row1WrongRange.setAttribute("data-ln-gridid", "x");
    row1WrongRange.setAttribute("data-ln-header-row-1", "true");
    row1WrongRange.setAttribute("data-ln-header-range", "5,10");
    header.appendChild(row1WrongRange);

    const row1Cell = document.createElement("div");
    row1Cell.tabIndex = 0;
    row1Cell.setAttribute("data-ln-gridid", "x");
    row1Cell.setAttribute("data-ln-header-cell", "true");
    row1Cell.setAttribute("data-ln-colindex", "1");
    row1Cell.setAttribute("data-ln-rowindex", "1");
    row1Cell.setAttribute("data-ln-header-row-1", "true");
    row1Cell.setAttribute("data-ln-header-range", "0,3");
    header.appendChild(row1Cell);

    row1Cell.focus();
    await expect.element(row1Cell).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: {
        kind: "header-group-cell",
        colIndex: 1,
        columnStartIndex: 0,
        columnEndIndex: 3,
        hierarchyRowIndex: 1,
      },
      posElement: row1Cell,
      active: row1Cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(row0Cell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: {
        kind: "header-group-cell",
        colIndex: 1,
        columnStartIndex: 0,
        columnEndIndex: 3,
        hierarchyRowIndex: 0,
      },
      posElement: row0Cell,
      active: row0Cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(row1Cell).toHaveFocus();
  });

  test("Should not move when no cell at target row covers the colIndex", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    viewport.appendChild(header);

    // Row 0 has only a cell with range that does NOT cover colIndex 8
    const row0Cell = document.createElement("div");
    row0Cell.tabIndex = 0;
    row0Cell.setAttribute("data-ln-gridid", "x");
    row0Cell.setAttribute("data-ln-header-row-0", "true");
    row0Cell.setAttribute("data-ln-header-range", "0,3");
    header.appendChild(row0Cell);

    const row1Cell = document.createElement("div");
    row1Cell.tabIndex = 0;
    row1Cell.setAttribute("data-ln-gridid", "x");
    row1Cell.setAttribute("data-ln-header-cell", "true");
    row1Cell.setAttribute("data-ln-colindex", "8");
    row1Cell.setAttribute("data-ln-rowindex", "1");
    row1Cell.setAttribute("data-ln-header-row-1", "true");
    row1Cell.setAttribute("data-ln-header-range", "8,9");
    header.appendChild(row1Cell);

    row1Cell.focus();
    await expect.element(row1Cell).toHaveFocus();

    // colIndex=8 is not within "0,3" at row 0, so find returns undefined → ?? null → no focus
    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: {
        kind: "header-group-cell",
        colIndex: 8,
        columnStartIndex: 8,
        columnEndIndex: 9,
        hierarchyRowIndex: 1,
      },
      posElement: row1Cell,
      active: row1Cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(row1Cell).toHaveFocus();
  });
});
