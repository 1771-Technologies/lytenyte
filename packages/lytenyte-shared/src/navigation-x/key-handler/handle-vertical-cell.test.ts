import { describe, expect, test } from "vitest";
import { handleVertical } from "./handle-vertical.js";
import { wait } from "@1771technologies/js-utils";

const scrollIntoView = () => {};
const done = () => {};
const cp = { get: () => null as any, set: (fn: any) => fn({}) };

describe("handleVertical", () => {
  test("Should handle modified navigation: jump to first row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell2 = document.createElement("div");
    cell2.tabIndex = 0;
    cell2.setAttribute("data-ln-gridid", "x");
    cell2.setAttribute("data-ln-cell", "true");
    cell2.setAttribute("data-ln-rowindex", "2");
    cell2.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell2);

    cell2.focus();
    await expect.element(cell2).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 2, colIndex: 0, root: null },
      posElement: cell2,
      active: cell2,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should handle modified navigation: jump to last row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell2 = document.createElement("div");
    cell2.tabIndex = 0;
    cell2.setAttribute("data-ln-gridid", "x");
    cell2.setAttribute("data-ln-cell", "true");
    cell2.setAttribute("data-ln-rowindex", "2");
    cell2.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell2);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell2).toHaveFocus();
  });

  test("Should not move when modified and already at the boundary", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate up from row 0 to header (handleFocusHeaderFromRow) - no header", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate up from row 0 to floating cell when floating is enabled", async () => {
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

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(floatingCell).toHaveFocus();
  });

  test("Should navigate up from row 0 to last header row cell when no floating", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    // No-range cell FIRST so find() iterates it and hits if(!range) branch
    const headerCellNoRange = document.createElement("div");
    headerCellNoRange.setAttribute("data-ln-gridid", "x");
    headerCellNoRange.setAttribute("data-ln-header-row-0", "true");
    viewport.appendChild(headerCellNoRange);

    // Wrong-range cell second (covers range false branch)
    const headerCellWrongRange = document.createElement("div");
    headerCellWrongRange.setAttribute("data-ln-gridid", "x");
    headerCellWrongRange.setAttribute("data-ln-header-row-0", "true");
    headerCellWrongRange.setAttribute("data-ln-header-range", "5,10");
    viewport.appendChild(headerCellWrongRange);

    // Matching cell last
    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-cell", "true");
    headerCell.setAttribute("data-ln-colindex", "0");
    headerCell.setAttribute("data-ln-header-row-0", "true");
    headerCell.setAttribute("data-ln-header-range", "0,3");
    viewport.appendChild(headerCell);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(headerCell).toHaveFocus();
  });

  test("Should not focus when no header cell covers the colIndex (handleFocusHeaderFromRow)", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const header = document.createElement("div");
    header.setAttribute("data-ln-gridid", "x");
    header.setAttribute("data-ln-header", "true");
    header.setAttribute("data-ln-rowcount", "1");
    viewport.appendChild(header);

    // Only a cell with range "0,3" — does not cover colIndex=8
    const headerCell = document.createElement("div");
    headerCell.tabIndex = 0;
    headerCell.setAttribute("data-ln-gridid", "x");
    headerCell.setAttribute("data-ln-header-row-0", "true");
    headerCell.setAttribute("data-ln-header-range", "0,3");
    viewport.appendChild(headerCell);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "8");
    viewport.appendChild(cell0);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    // find() returns undefined → ?? null → no focus change
    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 8, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate down to the detail row when detail is expanded at current row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const detailInner = document.createElement("button");
    detailInner.tabIndex = 0;

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.appendChild(detailInner);
    viewport.appendChild(detail);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await expect.element(detailInner).toHaveFocus();
  });

  test("Should navigate up into the detail row when the row above has an expanded detail", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    const detailInner = document.createElement("button");
    detailInner.tabIndex = 0;

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.appendChild(detailInner);
    viewport.appendChild(detail);

    cell1.focus();
    await expect.element(cell1).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      posElement: cell1,
      active: cell1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await expect.element(detailInner).toHaveFocus();
  });

  test("Should navigate up to the previous cell", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    cell1.focus();
    await expect.element(cell1).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      posElement: cell1,
      active: cell1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate down to the next cell", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell1).toHaveFocus();
  });

  test("Should navigate up using root.rowIndex when cell has a row span", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell2 = document.createElement("div");
    cell2.tabIndex = 0;
    cell2.setAttribute("data-ln-gridid", "x");
    cell2.setAttribute("data-ln-cell", "true");
    cell2.setAttribute("data-ln-rowindex", "2");
    cell2.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell2);

    cell2.focus();
    await expect.element(cell2).toHaveFocus();

    // pos.root.rowIndex = 1, so nextIndex = 1 - 1 = 0 → getRootCell(0,0) → cell0
    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: {
        kind: "cell",
        rowIndex: 2,
        colIndex: 0,
        root: { rowIndex: 1, colIndex: 0, rowSpan: 1, colSpan: 1 },
      },
      posElement: cell2,
      active: cell2,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate down using root.rowIndex + root.rowSpan when cell has a row span", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const cell2 = document.createElement("div");
    cell2.tabIndex = 0;
    cell2.setAttribute("data-ln-gridid", "x");
    cell2.setAttribute("data-ln-cell", "true");
    cell2.setAttribute("data-ln-rowindex", "2");
    cell2.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell2);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    // root.rowIndex=0, root.rowSpan=2, so nextIndex = 0 + 2 = 2
    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: {
        kind: "cell",
        rowIndex: 0,
        colIndex: 0,
        root: { rowIndex: 0, colIndex: 0, rowSpan: 2, colSpan: 1 },
      },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 5,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell2).toHaveFocus();
  });

  test("Should focus the detail itself when it has no tabbable children (going down)", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    // Detail with no tabbable children — detail itself should be focused
    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await expect.element(detail).toHaveFocus();
  });

  test("Should not change focus when detail element is missing (going down)", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    // No detail element in DOM even though isRowDetailExpanded returns true
    cell0.focus();
    await expect.element(cell0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      posElement: cell0,
      active: cell0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await wait();
    await expect.element(cell0).toHaveFocus();
  });

  test("Should focus the detail itself when it has no tabbable children (going up to row above)", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    // Detail at row 0 with no tabbable children — detail itself should be focused
    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    cell1.focus();
    await expect.element(cell1).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      posElement: cell1,
      active: cell1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await expect.element(detail).toHaveFocus();
  });

  test("Should not change focus when detail element is missing for row above (going up)", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    // No detail element in DOM even though row 0 is "expanded"
    cell1.focus();
    await expect.element(cell1).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      posElement: cell1,
      active: cell1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: (idx) => idx === 0,
    });

    await wait();
    await expect.element(cell1).toHaveFocus();
  });

  test("Should fall through all kind checks when given an unrecognized kind", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    viewport.appendChild(cell);
    cell.focus();
    await expect.element(cell).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "fax", colIndex: 0, rowIndex: 0 } as any,
      posElement: cell,
      active: cell,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell).toHaveFocus();
  });

  test("Should not move when getRootCell returns null during normal navigation", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    cell1.focus();
    await expect.element(cell1).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      posElement: cell1,
      active: cell1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await wait();
    await expect.element(cell1).toHaveFocus();
  });
});
