import { describe, expect, test } from "vitest";
import { handleHomeEnd } from "./handle-home-end.js";
import { wait } from "@1771technologies/js-utils";

describe("handleHomeEnd", () => {
  test.only("Should move horizontal if the modified key is not present", async () => {
    const scrollIntoView = () => {};
    const done = () => {};

    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const fullWidthRow = document.createElement("div");
    fullWidthRow.setAttribute("data-ln-gridid", "x");
    fullWidthRow.setAttribute("data-ln-row", "true");
    fullWidthRow.setAttribute("data-ln-rowtype", "full-width");
    fullWidthRow.setAttribute("data-ln-rowindex", "2");
    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.innerText = "hello";
    fullWidthRow.appendChild(cell);
    viewport.appendChild(fullWidthRow);

    const cellB0 = document.createElement("div");
    const cellA0 = document.createElement("div");
    const cellA1 = document.createElement("div");
    const cellA2 = document.createElement("div");

    cellB0.tabIndex = 0;
    cellA0.tabIndex = 0;
    cellA1.tabIndex = 0;
    cellA2.tabIndex = 0;

    cellB0.textContent = "X";
    cellA0.textContent = "X";
    cellA1.textContent = "X";
    cellA2.textContent = "X";

    cellB0.setAttribute("data-ln-gridid", "x");
    cellA0.setAttribute("data-ln-gridid", "x");
    cellA1.setAttribute("data-ln-gridid", "x");
    cellA2.setAttribute("data-ln-gridid", "x");
    cellB0.setAttribute("data-ln-cell", "true");
    cellA0.setAttribute("data-ln-cell", "true");
    cellA1.setAttribute("data-ln-cell", "true");
    cellA2.setAttribute("data-ln-cell", "true");
    cellB0.setAttribute("data-ln-rowindex", "0");
    cellA0.setAttribute("data-ln-rowindex", "1");
    cellA1.setAttribute("data-ln-rowindex", "1");
    cellA2.setAttribute("data-ln-rowindex", "1");
    cellB0.setAttribute("data-ln-colindex", "0");
    cellA0.setAttribute("data-ln-colindex", "0");
    cellA1.setAttribute("data-ln-colindex", "1");
    cellA2.setAttribute("data-ln-colindex", "2");

    viewport.appendChild(cellA0);
    viewport.appendChild(cellB0);
    viewport.appendChild(cellA1);
    viewport.appendChild(cellA2);

    cellA1.focus();
    await expect.element(cellA1).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: (r: number, c: number) => ({ kind: "cell", colIndex: c, root: null, rowIndex: r }),
      gridId: "x",
      isEnd: false,
      modified: false,
      pos: { kind: "cell", colIndex: 1, root: null, rowIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await expect.element(cellA0).toHaveFocus();

    cellA1.focus();
    await expect.element(cellA1).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: (r: number, c: number) => ({ kind: "cell", colIndex: c, root: null, rowIndex: r }),
      gridId: "x",
      isEnd: false,
      modified: true,
      pos: { kind: "cell", colIndex: 1, root: null, rowIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await expect.element(cellB0).toHaveFocus();
    cellA1.focus();
    await expect.element(cellA1).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: () => null,
      gridId: "x",
      isEnd: false,
      modified: true,
      pos: { kind: "cell", colIndex: 1, root: null, rowIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await wait(20);
    await expect.element(cellA1).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: (_: number, c: number) => ({ kind: "full-width", colIndex: c, root: null, rowIndex: 2 }),
      gridId: "x",
      isEnd: false,
      modified: true,
      pos: { kind: "cell", colIndex: 1, root: null, rowIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await expect.element(cell).toHaveFocus();

    cellB0.focus();
    await expect.element(cellB0).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: (r: number, c: number) => ({ kind: "cell", colIndex: c, root: null, rowIndex: r }),
      gridId: "x",
      isEnd: true,
      modified: true,
      pos: { kind: "cell", colIndex: 1, root: null, rowIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await expect.element(cellA2).toHaveFocus();

    handleHomeEnd({
      active: cellA1,
      columnCount: 3,
      cp: {
        get: () => null,
        set: (fn: any) => {
          fn({});
        },
      },
      done,
      scrollIntoView,
      getRootCell: (r: number, c: number) => ({ kind: "cell", colIndex: c, root: null, rowIndex: r }),
      gridId: "x",
      isEnd: true,
      modified: true,
      pos: { kind: "floating-cell", colIndex: 1 },
      posElement: cellA1,
      rowCount: 2,
      viewport,
    });

    await expect.element(cellA2).toHaveFocus();
  });
});
