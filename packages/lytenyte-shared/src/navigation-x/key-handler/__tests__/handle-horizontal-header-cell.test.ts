import { expect, test, vi } from "vitest";
import { handleHorizontal } from "../handle-horizontal.js";

test("handleHorizontal should handle header or floating cells", async () => {
  const viewport = document.createElement("div");
  const headerRow = document.createElement("div");
  const headerCellMiddle = document.createElement("div");
  const headerCellLeft = document.createElement("div");
  const headerCellRight = document.createElement("div");

  headerCellMiddle.tabIndex = 0;
  headerCellLeft.tabIndex = 0;
  headerCellRight.tabIndex = 0;

  headerRow.appendChild(headerCellMiddle);
  headerRow.appendChild(headerCellLeft);
  headerRow.appendChild(headerCellRight);
  viewport.appendChild(headerRow);

  document.body.appendChild(viewport);

  headerCellMiddle.setAttribute("data-ln-gridid", "x");
  headerCellLeft.setAttribute("data-ln-gridid", "x");
  headerCellRight.setAttribute("data-ln-gridid", "x");

  headerCellMiddle.setAttribute("data-ln-header-cell", "true");
  headerCellLeft.setAttribute("data-ln-header-cell", "true");
  headerCellRight.setAttribute("data-ln-header-cell", "true");

  headerCellMiddle.setAttribute("data-ln-colindex", "1");
  headerCellLeft.setAttribute("data-ln-colindex", "0");
  headerCellRight.setAttribute("data-ln-colindex", "2");

  headerCellMiddle.focus();
  await expect.element(headerCellMiddle).toHaveFocus();

  const setter = vi.fn((fn) => fn({}));
  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "header-cell", colIndex: 1 },
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
    pos: { kind: "header-cell", colIndex: 2 },
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
    pos: { kind: "header-cell", colIndex: 1 },
    active: headerCellMiddle,
    posElement: headerCellMiddle,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(headerCellLeft).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "header-cell", colIndex: 0 },
    active: headerCellLeft,
    posElement: headerCellLeft,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(headerCellLeft).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "header-cell", colIndex: 0 },
    active: headerCellLeft,
    posElement: headerCellLeft,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: true,
  });

  await expect.element(headerCellRight).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "header-cell", colIndex: 2 },
    active: headerCellRight,
    posElement: headerCellRight,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: true,
  });
  await expect.element(headerCellLeft).toHaveFocus();

  const buttonA = document.createElement("button");
  buttonA.tabIndex = 0;
  headerCellLeft.appendChild(buttonA);

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "header-cell", colIndex: 0 },
    active: headerCellLeft,
    posElement: headerCellLeft,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });
  await expect.element(buttonA).toHaveFocus();

  headerCellMiddle.setAttribute("data-ln-header-floating", "true");
  headerCellLeft.setAttribute("data-ln-header-floating", "true");
  headerCellRight.setAttribute("data-ln-header-floating", "true");

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "floating-cell", colIndex: 0 },
    active: buttonA,
    posElement: headerCellLeft,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });
  await expect.element(headerCellMiddle).toHaveFocus();
});
