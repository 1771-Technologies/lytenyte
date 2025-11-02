import { expect, test, vi } from "vitest";
import { handleHorizontal } from "../handle-horizontal.js";
import { wait } from "../../../js-utils/sleep.js";

test("handleHorizontal should handle header-group-cell", async () => {
  const viewport = document.createElement("div");
  const headerRow = document.createElement("div");
  const headerCellMiddle = document.createElement("div");
  const headerCellLeft = document.createElement("div");
  const headerCellRight = document.createElement("div");

  headerRow.appendChild(headerCellMiddle);
  headerRow.appendChild(headerCellLeft);
  headerRow.appendChild(headerCellRight);
  viewport.appendChild(headerRow);

  document.body.appendChild(viewport);

  headerRow.setAttribute("data-ln-gridid", "x");

  headerCellMiddle.setAttribute("data-ln-header-cell", "true");
  headerCellMiddle.setAttribute("data-ln-gridid", "x");
  headerCellMiddle.setAttribute("data-ln-rowindex", "0");
  headerCellMiddle.setAttribute("data-ln-colindex", "1");
  headerCellMiddle.setAttribute("data-ln-header-range", "1,2");
  headerCellMiddle.setAttribute("data-ln-header-row-0", "true");
  headerCellMiddle.tabIndex = 0;

  headerCellLeft.setAttribute("data-ln-header-cell", "true");
  headerCellLeft.setAttribute("data-ln-gridid", "x");
  headerCellLeft.setAttribute("data-ln-rowindex", "0");
  headerCellLeft.setAttribute("data-ln-colindex", "0");
  headerCellLeft.setAttribute("data-ln-header-range", "0,1");
  headerCellLeft.setAttribute("data-ln-header-row-0", "true");
  headerCellLeft.tabIndex = 0;

  headerCellRight.setAttribute("data-ln-header-cell", "true");
  headerCellRight.setAttribute("data-ln-gridid", "x");
  headerCellRight.setAttribute("data-ln-rowindex", "0");
  headerCellRight.setAttribute("data-ln-colindex", "2");
  headerCellRight.setAttribute("data-ln-header-range", "2,3");
  headerCellRight.setAttribute("data-ln-header-row-0", "true");
  headerCellRight.tabIndex = 0;

  const setter = vi.fn();
  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 1,
      columnStartIndex: 1,
      columnEndIndex: 2,
      hierarchyRowIndex: 0,
    },

    active: headerCellMiddle,
    posElement: headerCellMiddle,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(headerCellRight).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 2,
      columnStartIndex: 2,
      columnEndIndex: 3,
      hierarchyRowIndex: 0,
    },

    active: headerCellRight,
    posElement: headerCellRight,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(headerCellMiddle).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 1,
      columnStartIndex: 1,
      columnEndIndex: 2,
      hierarchyRowIndex: 0,
    },

    active: headerCellRight,
    posElement: headerCellRight,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  // Modified focus should move to the start
  await expect.element(headerCellLeft).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: false,
    modified: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 0,
      columnStartIndex: 0,
      columnEndIndex: 1,
      hierarchyRowIndex: 0,
    },

    active: headerCellRight,
    posElement: headerCellRight,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });

  // Modified focus should move to the end
  await expect.element(headerCellRight).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: true,
    modified: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 2,
      columnStartIndex: 2,
      columnEndIndex: 3,
      hierarchyRowIndex: 0,
    },

    active: headerCellRight,
    posElement: headerCellRight,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });

  // Going back again should be fine.
  await expect.element(headerCellLeft).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: true,
    modified: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 0,
      columnStartIndex: 0,
      columnEndIndex: 1,
      hierarchyRowIndex: 0,
    },

    active: headerCellLeft,
    posElement: headerCellLeft,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });
  await expect.element(headerCellLeft).toHaveFocus();

  // Should not focus anything or move the focus when there is no range or the other cells
  // are out of focus.
  headerCellLeft.setAttribute("data-ln-header-range", "4,5");
  headerCellRight.removeAttribute("data-ln-header-range");

  headerCellMiddle.focus();
  await expect.element(headerCellMiddle).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    modified: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 1,
      columnStartIndex: 1,
      columnEndIndex: 2,
      hierarchyRowIndex: 0,
    },

    active: headerCellMiddle,
    posElement: headerCellMiddle,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });

  await wait(100);

  await expect.element(headerCellMiddle).toHaveFocus();

  // Should not handle the cell when its not a header-group-cell.
  handleHorizontal({
    viewport,
    isBack: true,
    modified: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "cell",
      colIndex: 1,
      rowIndex: 2,
      root: null,
    },

    active: headerCellMiddle,
    posElement: headerCellMiddle,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });

  const a = document.createElement("button");
  a.tabIndex = 0;
  headerCellMiddle.appendChild(a);

  handleHorizontal({
    viewport,
    isBack: false,
    modified: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: {
      kind: "header-group-cell",
      colIndex: 1,
      columnStartIndex: 1,
      columnEndIndex: 2,
      hierarchyRowIndex: 0,
    },

    active: headerCellMiddle,
    posElement: headerCellMiddle,
    cp: { get: () => null as any, set: setter },
    done: () => {},
  });

  await expect.element(a).toHaveFocus();
});
