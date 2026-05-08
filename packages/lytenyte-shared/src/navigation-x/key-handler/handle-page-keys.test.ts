import { describe, expect, test } from "vitest";
import { handlePageKeys } from "./handle-page-keys.js";
import { wait } from "@1771technologies/js-utils";

describe("handlePageKeys", () => {
  test("Should handle all page keys", async () => {
    const scrollIntoView = () => {};
    const done = () => {};

    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    const cellB0 = document.createElement("div");
    const cellA0 = document.createElement("div");
    const cellC0 = document.createElement("div");

    cellB0.tabIndex = 0;
    cellA0.tabIndex = 0;
    cellC0.tabIndex = 0;

    cellB0.textContent = "X";
    cellA0.textContent = "X";
    cellC0.textContent = "X";

    cellB0.setAttribute("data-ln-gridid", "x");
    cellA0.setAttribute("data-ln-gridid", "x");
    cellC0.setAttribute("data-ln-gridid", "x");

    cellB0.setAttribute("data-ln-cell", "true");
    cellA0.setAttribute("data-ln-cell", "true");
    cellC0.setAttribute("data-ln-cell", "true");

    cellB0.setAttribute("data-ln-rowindex", "0");
    cellA0.setAttribute("data-ln-rowindex", "1");
    cellC0.setAttribute("data-ln-rowindex", "2");

    cellB0.setAttribute("data-ln-colindex", "0");
    cellA0.setAttribute("data-ln-colindex", "0");
    cellC0.setAttribute("data-ln-colindex", "0");

    const rowA = document.createElement("div");
    rowA.setAttribute("data-ln-gridid", "x");
    rowA.setAttribute("data-ln-row", "true");
    rowA.appendChild(cellA0);
    const rowB = document.createElement("div");
    rowB.setAttribute("data-ln-gridid", "x");
    rowB.setAttribute("data-ln-row", "true");
    rowB.appendChild(cellB0);
    const rowC = document.createElement("div");
    rowC.setAttribute("data-ln-gridid", "x");
    rowC.setAttribute("data-ln-row", "true");
    rowC.appendChild(cellC0);

    viewport.appendChild(rowA);
    viewport.appendChild(rowB);
    viewport.appendChild(rowC);

    cellA0.focus();
    await expect.element(cellA0).toHaveFocus();

    handlePageKeys({
      isUp: false,
      cp: { get: () => null, set: (fn: any) => fn({}) },
      done,
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      gridId: "x",
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      rowCount: 3,
      scrollIntoView,
      viewport,
    });

    await expect.element(cellC0).toHaveFocus();

    handlePageKeys({
      isUp: true,
      cp: { get: () => null, set: (fn: any) => fn({}) },
      done,
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      gridId: "x",
      pos: { kind: "cell", rowIndex: 1, colIndex: 0, root: null },
      rowCount: 3,
      scrollIntoView,
      viewport,
    });

    await expect.element(cellB0).toHaveFocus();
    handlePageKeys({
      isUp: true,
      cp: { get: () => null, set: (fn: any) => fn({}) },
      done,
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      gridId: "x",
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      rowCount: 3,
      scrollIntoView,
      viewport,
    });
    await expect.element(cellB0).toHaveFocus();

    handlePageKeys({
      isUp: true,
      cp: { get: () => null, set: (fn: any) => fn({}) },
      done,
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      gridId: "x",
      pos: { kind: "floating-cell", colIndex: 0 },
      rowCount: 3,
      scrollIntoView,
      viewport,
    });
    await expect.element(cellB0).toHaveFocus();

    rowA.remove();
    rowB.remove();
    rowC.remove();

    await wait();

    handlePageKeys({
      isUp: true,
      cp: { get: () => null, set: (fn: any) => fn({}) },
      done,
      getRootCell: (r, c) => ({ kind: "cell", rowIndex: r, colIndex: c, root: null }),
      gridId: "x",
      pos: { kind: "cell", rowIndex: 0, colIndex: 0, root: null },
      rowCount: 3,
      scrollIntoView,
      viewport,
    });
  });
});
