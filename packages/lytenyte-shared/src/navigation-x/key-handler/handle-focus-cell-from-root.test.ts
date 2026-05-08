import { describe, expect, test } from "vitest";
import { handleFocusCellFromRoot } from "./handle-focus-cell-from-root.js";
import { wait } from "@1771technologies/js-utils";

describe("handleFocusCellFromRoot", () => {
  test("Should handle focusing a full width row", async () => {
    const scrollIntoView = () => {};
    const done = () => {};

    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    handleFocusCellFromRoot(
      {
        scrollIntoView,
        done,
        gridId: "x",
        viewport,
        cp: { get: () => null, set: () => {} },
        pos: { kind: "cell", colIndex: 0, root: null, rowIndex: 2 },
      },
      null,
    );

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

    await wait();

    handleFocusCellFromRoot(
      {
        scrollIntoView,
        done,
        gridId: "x",
        viewport,
        cp: {
          get: () => null,
          set: (fn: any) => {
            fn({});
          },
        },
        pos: { kind: "cell", colIndex: 0, root: null, rowIndex: 2 },
      },
      { kind: "full-width", colIndex: 0, rowIndex: 2 },
    );

    await expect.element(cell).toHaveFocus();
  });

  test("Should handle cell root focus", async () => {
    const scrollIntoView = () => {};
    const done = () => {};

    const viewport = document.createElement("div");
    document.body.appendChild(viewport);

    handleFocusCellFromRoot(
      {
        scrollIntoView,
        done,
        gridId: "x",
        viewport,
        cp: {
          get: () => null,
          set: (fn: any) => {
            fn({});
          },
        },
        pos: { kind: "cell", colIndex: 0, root: null, rowIndex: 2 },
      },
      { kind: "cell", colIndex: 0, rowIndex: 0, root: { colIndex: 2, colSpan: 2, rowIndex: 2, rowSpan: 2 } },
    );

    const cell = document.createElement("div");
    cell.tabIndex = 0;
    cell.textContent = "Hello";
    cell.setAttribute("data-ln-gridid", "x");
    cell.setAttribute("data-ln-cell", "true");
    cell.setAttribute("data-ln-rowindex", "2");
    cell.setAttribute("data-ln-colindex", "2");
    viewport.appendChild(cell);

    await expect.element(cell).toHaveFocus();

    handleFocusCellFromRoot(
      {
        scrollIntoView,
        done,
        gridId: "x",
        viewport,
        cp: {
          get: () => null,
          set: (fn: any) => {
            fn({});
          },
        },
        pos: { kind: "cell", colIndex: 0, root: null, rowIndex: 2 },
      },
      { kind: "cell", colIndex: 2, rowIndex: 2, root: null },
    );
  });
});
