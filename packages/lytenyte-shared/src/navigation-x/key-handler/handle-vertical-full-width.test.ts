import { describe, expect, test } from "vitest";
import { handleVertical } from "./handle-vertical.js";
import { wait } from "@1771technologies/js-utils";

const scrollIntoView = () => {};
const done = () => {};
const cp = { get: () => null as any, set: (fn: any) => fn({}) };

function makeFullWidthRow(gridId: string, rowIndex: number) {
  const row = document.createElement("div");
  row.setAttribute("data-ln-gridid", gridId);
  row.setAttribute("data-ln-row", "true");
  row.setAttribute("data-ln-rowtype", "full-width");
  row.setAttribute("data-ln-rowindex", String(rowIndex));
  const child = document.createElement("div");
  child.tabIndex = 0;
  row.appendChild(child);
  return { row, child };
}

describe("handleVertical", () => {
  test("Should handle modified navigation: jump to first row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    const { row: row2, child: child2 } = makeFullWidthRow("x", 2);
    viewport.appendChild(row0);
    viewport.appendChild(row2);

    child2.focus();
    await expect.element(child2).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "full-width", rowIndex: r, colIndex: c }),
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 2, colIndex: 0 },
      posElement: row2,
      active: child2,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(child0).toHaveFocus();
  });

  test("Should handle modified navigation: jump to last row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    const { row: row2, child: child2 } = makeFullWidthRow("x", 2);
    viewport.appendChild(row0);
    viewport.appendChild(row2);

    child0.focus();
    await expect.element(child0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "full-width", rowIndex: r, colIndex: c }),
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 0, colIndex: 0 },
      posElement: row0,
      active: child0,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(child2).toHaveFocus();
  });

  test("Should not move when modified and already at boundary", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    viewport.appendChild(row0);

    child0.focus();
    await expect.element(child0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 0, colIndex: 0 },
      posElement: row0,
      active: child0,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(child0).toHaveFocus();
  });

  test("Should navigate up from row 0 to the header", async () => {
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
    headerCell.setAttribute("data-ln-header-row-0", "true");
    headerCell.setAttribute("data-ln-header-range", "0,3");
    viewport.appendChild(headerCell);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    viewport.appendChild(row0);

    child0.focus();
    await expect.element(child0).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 0, colIndex: 0 },
      posElement: row0,
      active: child0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(headerCell).toHaveFocus();
  });

  test("Should navigate up to the previous full-width row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    const { row: row1, child: child1 } = makeFullWidthRow("x", 1);
    viewport.appendChild(row0);
    viewport.appendChild(row1);

    child1.focus();
    await expect.element(child1).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "full-width", rowIndex: r, colIndex: c }),
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 1, colIndex: 0 },
      posElement: row1,
      active: child1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(child0).toHaveFocus();
  });

  test("Should navigate down to the next full-width row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row0, child: child0 } = makeFullWidthRow("x", 0);
    const { row: row1, child: child1 } = makeFullWidthRow("x", 1);
    viewport.appendChild(row0);
    viewport.appendChild(row1);

    child0.focus();
    await expect.element(child0).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "full-width", rowIndex: r, colIndex: c }),
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 0, colIndex: 0 },
      posElement: row0,
      active: child0,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(child1).toHaveFocus();
  });

  test("Should not move when getRootCell returns null during normal navigation", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const { row: row1, child: child1 } = makeFullWidthRow("x", 1);
    viewport.appendChild(row1);

    child1.focus();
    await expect.element(child1).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "full-width", rowIndex: 1, colIndex: 0 },
      posElement: row1,
      active: child1,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await wait();
    await expect.element(child1).toHaveFocus();
  });
});

describe("handleVertical - detail", () => {
  test("Should handle modified navigation for detail: jump to first row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell0 = document.createElement("div");
    cell0.tabIndex = 0;
    cell0.setAttribute("data-ln-gridid", "x");
    cell0.setAttribute("data-ln-cell", "true");
    cell0.setAttribute("data-ln-rowindex", "0");
    cell0.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell0);

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "2");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    detail.focus();
    await expect.element(detail).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "detail", rowIndex: 2, colIndex: 0 },
      posElement: detail,
      active: detail,
      done,
      modified: true,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell0).toHaveFocus();
  });

  test("Should navigate up from detail to the row above it", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "1");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    detail.focus();
    await expect.element(detail).toHaveFocus();

    handleVertical({
      isUp: true,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "detail", rowIndex: 1, colIndex: 0 },
      posElement: detail,
      active: detail,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell1).toHaveFocus();
  });

  test("Should navigate down from detail to the next row", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    const cell1 = document.createElement("div");
    cell1.tabIndex = 0;
    cell1.setAttribute("data-ln-gridid", "x");
    cell1.setAttribute("data-ln-cell", "true");
    cell1.setAttribute("data-ln-rowindex", "1");
    cell1.setAttribute("data-ln-colindex", "0");
    viewport.appendChild(cell1);

    detail.focus();
    await expect.element(detail).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      viewport,
      cp,
      pos: { kind: "detail", rowIndex: 0, colIndex: 0 },
      posElement: detail,
      active: detail,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await expect.element(cell1).toHaveFocus();
  });

  test("Should not move when getRootCell returns null during detail navigation", async () => {
    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const detail = document.createElement("div");
    detail.setAttribute("data-ln-gridid", "x");
    detail.setAttribute("data-ln-rowindex", "0");
    detail.setAttribute("data-ln-row-detail", "true");
    detail.tabIndex = 0;
    viewport.appendChild(detail);

    detail.focus();
    await expect.element(detail).toHaveFocus();

    handleVertical({
      isUp: false,
      scrollIntoView,
      gridId: "x",
      getRootCell: () => null,
      viewport,
      cp,
      pos: { kind: "detail", rowIndex: 0, colIndex: 0 },
      posElement: detail,
      active: detail,
      done,
      modified: false,
      rowCount: 3,
      isRowDetailExpanded: () => false,
    });

    await wait();
    await expect.element(detail).toHaveFocus();
  });
});
