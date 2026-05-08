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
    cell.setAttribute("data-ln-gridid", "x");
    cell.setAttribute("data-ln-header-cell", "true");
    cell.setAttribute("data-ln-header-floating", "true");
    cell.setAttribute("data-ln-colindex", "0");
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
      pos: { kind: "floating-cell", colIndex: 0 },
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should navigate up to the last header row cell matching colIndex", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "2");
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "1");
    header.appendChild(floatingCell);

    // Last header row (rowCount - 1 = 1), cell matching colIndex=1
    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "1");
    headerCell.setAttribute("data-ln-header-row-1", "true");
    header.appendChild(headerCell);

    floatingCell.focus();
    await expect.element(floatingCell).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "floating-cell", colIndex: 1 },
      posElement: floatingCell,
      active: floatingCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(headerCell).toHaveFocus();
  });

  test("Should not move down when getRootCell returns null", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "0");
    header.appendChild(floatingCell);

    floatingCell.focus();
    await expect.element(floatingCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "floating-cell", colIndex: 0 },
      posElement: floatingCell,
      active: floatingCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(floatingCell).toHaveFocus();
  });

  test("Should navigate down to a grid cell", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "0");
    header.appendChild(floatingCell);

    const gridCell = document.createElement("div");
    gridCell.tabIndex = 0;
    gridCell.setAttribute("data-ln-gridid", "x");
    gridCell.setAttribute("data-ln-cell", "true");
    gridCell.setAttribute("data-ln-rowindex", "0");
    gridCell.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(gridCell);

    floatingCell.focus();
    await expect.element(floatingCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => ({ kind: "cell", rowIndex: 0, colIndex: 0, root: null }),
      viewport,
      cp,
      pos: { kind: "floating-cell", colIndex: 0 },
      posElement: floatingCell,
      active: floatingCell,
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
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "1");
    header.appendChild(floatingCell);

    const gridCell = document.createElement("div");
    gridCell.tabIndex = 0;
    gridCell.setAttribute("data-ln-gridid", "x");
    gridCell.setAttribute("data-ln-cell", "true");
    gridCell.setAttribute("data-ln-rowindex", "0");
    gridCell.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(gridCell);

    floatingCell.focus();
    await expect.element(floatingCell).toHaveFocus();

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
      pos: { kind: "floating-cell", colIndex: 1 },
      posElement: floatingCell,
      active: floatingCell,
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
    header.setAttribute("data-ln-floating", "true");
    viewport.appendChild(header);

    const floatingCell = document.createElement("div");
    floatingCell.tabIndex = 0;
    floatingCell.setAttribute("data-ln-gridid", "x");
    floatingCell.setAttribute("data-ln-header-cell", "true");
    floatingCell.setAttribute("data-ln-header-floating", "true");
    floatingCell.setAttribute("data-ln-colindex", "0");
    header.appendChild(floatingCell);

    const fullWidthRow = document.createElement("div");
    fullWidthRow.setAttribute("data-ln-gridid", "x");
    fullWidthRow.setAttribute("data-ln-row", "true");
    fullWidthRow.setAttribute("data-ln-rowtype", "full-width");
    fullWidthRow.setAttribute("data-ln-rowindex", "0");
    const fullWidthChild = document.createElement("div");
    fullWidthChild.tabIndex = 0;
    fullWidthRow.appendChild(fullWidthChild);
    viewport.appendChild(fullWidthRow);

    floatingCell.focus();
    await expect.element(floatingCell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => ({ kind: "full-width", rowIndex: 0, colIndex: 0 }),
      viewport,
      cp,
      pos: { kind: "floating-cell", colIndex: 0 },
      posElement: floatingCell,
      active: floatingCell,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(fullWidthChild).toHaveFocus();
  });
});
