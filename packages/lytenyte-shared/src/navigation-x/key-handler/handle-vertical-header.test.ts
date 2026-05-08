import { describe, expect, test } from "vitest";
import { handleVertical } from "./handle-vertical.js";

const scrollIntoView = () => {};
const done = () => {};
const cp = { get: () => null as any, set: (fn: any) => fn({}) };

describe("handleVertical", () => {
  test("Should return early if no header element exists in the viewport", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-gridid", "x");
    cell.setAttribute("data-ln-header-cell", "true");
    cell.setAttribute("data-ln-colindex", "0");
    cell.setAttribute("data-ln-rowindex", "0");
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
      pos: { kind: "header-cell", colIndex: 0 },
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should not move up when rowCount is 1", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.setAttribute("data-ln-gridid", "x");
    cell.setAttribute("data-ln-header-cell", "true");
    cell.setAttribute("data-ln-colindex", "0");
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
      pos: { kind: "header-cell", colIndex: 0 },
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should navigate up to the previous header row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    viewport.appendChild(header);

    // No-range cell first so find() iterates it and hits if(!range) branch
    const noRangeCell = document.createElement("div");
    noRangeCell.setAttribute("data-ln-gridid", "x");
    noRangeCell.setAttribute("data-ln-header-row-0", "true");
    header.appendChild(noRangeCell);

    const groupCell = document.createElement("div");
    groupCell.tabIndex = 0;
    groupCell.setAttribute("data-ln-gridid", "x");
    groupCell.setAttribute("data-ln-header-cell", "true");
    groupCell.setAttribute("data-ln-colindex", "0");
    groupCell.setAttribute("data-ln-rowindex", "0");
    groupCell.setAttribute("data-ln-header-row-0", "true");
    groupCell.setAttribute("data-ln-header-range", "0,3");
    header.appendChild(groupCell);

    const currentCell = document.createElement("div");
    currentCell.tabIndex = 0;
    currentCell.setAttribute("data-ln-gridid", "x");
    currentCell.setAttribute("data-ln-header-cell", "true");
    currentCell.setAttribute("data-ln-colindex", "1");
    currentCell.setAttribute("data-ln-rowindex", "1");
    currentCell.setAttribute("data-ln-header-row-1", "true");
    currentCell.setAttribute("data-ln-header-range", "1,2");
    header.appendChild(currentCell);

    currentCell.focus();
    await expect.element(currentCell).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 1 },
      posElement: currentCell,
      active: currentCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(groupCell).toHaveFocus();
  });

  test("Should not change focus when no cell at previous row covers the colIndex", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    viewport.appendChild(header);

    // Row 0 only has cells with range "0,3" — does not cover colIndex=8
    const row0Cell = document.createElement("div");
    row0Cell.tabIndex = 0;
    row0Cell.setAttribute("data-ln-gridid", "x");
    row0Cell.setAttribute("data-ln-header-row-0", "true");
    row0Cell.setAttribute("data-ln-header-range", "0,3");
    header.appendChild(row0Cell);

    const currentCell = document.createElement("div");
    currentCell.tabIndex = 0;
    currentCell.setAttribute("data-ln-gridid", "x");
    currentCell.setAttribute("data-ln-header-cell", "true");
    currentCell.setAttribute("data-ln-colindex", "8");
    currentCell.setAttribute("data-ln-rowindex", "1");
    currentCell.setAttribute("data-ln-header-row-1", "true");
    currentCell.setAttribute("data-ln-header-range", "8,9");
    header.appendChild(currentCell);

    currentCell.focus();
    await expect.element(currentCell).toHaveFocus();

    // find() returns undefined → ?? null → handleFocus gets null → no focus change
    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 8 },
      posElement: currentCell,
      active: currentCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(currentCell).toHaveFocus();
  });

  test("Should navigate down to the floating cell when floating is enabled", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "1");
    headerCell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(headerCell);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "1");
    header.appendChild(floatingCell);

    headerCell.focus();
    await expect.element(headerCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 1 },
      posElement: headerCell,
      active: headerCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(floatingCell).toHaveFocus();
  });

  test("Should not move down when getRootCell returns null and no floating", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "0");
    headerCell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(headerCell);

    headerCell.focus();
    await expect.element(headerCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 0 },
      posElement: headerCell,
      active: headerCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(headerCell).toHaveFocus();
  });

  test("Should navigate down to a grid cell", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "0");
    headerCell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(headerCell);

    const gridCell = document.createElement("div");
    gridCell.tabIndex = 0;
    gridCell.setAttribute("data-ln-gridid", "x");
    gridCell.setAttribute("data-ln-cell", "true");
    gridCell.setAttribute("data-ln-rowindex", "0");
    gridCell.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(gridCell);

    headerCell.focus();
    await expect.element(headerCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => ({ kind: "cell", rowIndex: 0, colIndex: 0, root: null }),
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 0 },
      posElement: headerCell,
      active: headerCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(gridCell).toHaveFocus();
  });

  test("Should navigate down to a grid cell using root.root when span is present", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "1");
    headerCell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(headerCell);

    const gridCell = document.createElement("div");
    gridCell.tabIndex = 0;
    gridCell.setAttribute("data-ln-gridid", "x");
    gridCell.setAttribute("data-ln-cell", "true");
    gridCell.setAttribute("data-ln-rowindex", "0");
    gridCell.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(gridCell);

    headerCell.focus();
    await expect.element(headerCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => ({
        kind: "cell",
        rowIndex: 1,
        colIndex: 1,
        root: { rowIndex: 0, colIndex: 0, rowSpan: 2, colSpan: 2 },
      }),
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 1 },
      posElement: headerCell,
      active: headerCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(gridCell).toHaveFocus();
  });

  test("Should navigate down to a full-width row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "0");
    headerCell.setAttribute("data-ln-rowindex", "0");
    header.appendChild(headerCell);

    const fullWidthRow = document.createElement("div");
    fullWidthRow.setAttribute("data-ln-gridid", "x");
    fullWidthRow.setAttribute("data-ln-row", "true");
    fullWidthRow.setAttribute("data-ln-rowtype", "full-width");
    fullWidthRow.setAttribute("data-ln-rowindex", "0");
    const fullWidthChild = document.createElement("div");
    fullWidthChild.tabIndex = 0;
    fullWidthRow.appendChild(fullWidthChild);
    viewport.appendChild(fullWidthRow);

    headerCell.focus();
    await expect.element(headerCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => ({ kind: "full-width", rowIndex: 0, colIndex: 0 }),
      viewport,
      cp,
      pos: { kind: "header-cell", colIndex: 0 },
      posElement: headerCell,
      active: headerCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(fullWidthChild).toHaveFocus();
  });
});
