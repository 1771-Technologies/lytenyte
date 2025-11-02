import { expect, test, vi } from "vitest";
import { handleHorizontal } from "../handle-horizontal.js";
import { wait } from "../../../js-utils/index.js";

test("handleHorizontal should handle cells", async () => {
  const leftCell = document.createElement("div");
  leftCell.tabIndex = 0;
  const middleCell = document.createElement("div");
  middleCell.tabIndex = 0;
  const rightCell = document.createElement("div");
  rightCell.tabIndex = 0;

  const row = document.createElement("div");

  row.setAttribute("data-ln-row", "true");
  row.setAttribute("data-ln-gridid", "x");

  leftCell.setAttribute("data-ln-cell", "true");
  leftCell.setAttribute("data-ln-colindex", "0");
  leftCell.setAttribute("data-ln-rowindex", "0");
  leftCell.setAttribute("data-ln-gridid", "x");
  middleCell.setAttribute("data-ln-cell", "true");
  middleCell.setAttribute("data-ln-colindex", "1");
  middleCell.setAttribute("data-ln-rowindex", "0");
  middleCell.setAttribute("data-ln-gridid", "x");
  rightCell.setAttribute("data-ln-cell", "true");
  rightCell.setAttribute("data-ln-colindex", "2");
  rightCell.setAttribute("data-ln-rowindex", "0");
  rightCell.setAttribute("data-ln-gridid", "x");

  const a = document.createElement("button");
  a.tabIndex = 0;
  middleCell.appendChild(a);
  row.appendChild(leftCell);
  row.appendChild(rightCell);
  row.appendChild(middleCell);

  const viewport = document.createElement("div");
  viewport.appendChild(row);
  document.body.appendChild(viewport);

  middleCell.focus();

  await expect.element(middleCell).toHaveFocus();

  const setter = vi.fn((fn) => fn({}));
  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 1, rowIndex: 0, root: null },
    active: middleCell,
    posElement: middleCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(a).toHaveFocus();
  middleCell.focus();
  a.remove();
  await expect.element(middleCell).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => ({ colIndex: 2, rowIndex: 0, root: null, kind: "cell" }),
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 1, rowIndex: 0, root: null },
    active: middleCell,
    posElement: middleCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(rightCell).toHaveFocus();

  middleCell.focus();
  await expect.element(middleCell).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => ({ colIndex: 0, rowIndex: 0, root: null, kind: "cell" }),
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 1, rowIndex: 0, root: null },
    active: middleCell,
    posElement: middleCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(leftCell).toHaveFocus();

  middleCell.focus();
  await expect.element(middleCell).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 1, rowIndex: 0, root: null },
    active: middleCell,
    posElement: middleCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });
  await wait();
  await expect.element(middleCell).toHaveFocus();

  leftCell.focus();
  await expect.element(leftCell).toHaveFocus();
  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 0, rowIndex: 0, root: null },
    active: leftCell,
    posElement: leftCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });
  await wait();
  await expect.element(leftCell).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => ({ kind: "cell", rowIndex: 0, colIndex: 2, root: null }),
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 0, rowIndex: 0, root: null },
    active: leftCell,
    posElement: leftCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: true,
  });

  await expect.element(rightCell).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => ({ kind: "cell", rowIndex: 0, colIndex: 0, root: null }),
    columnCount: 3,
    gridId: "x",
    pos: { kind: "cell", colIndex: 0, rowIndex: 0, root: null },
    active: rightCell,
    posElement: rightCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: true,
  });

  await expect.element(leftCell).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => ({ kind: "cell", rowIndex: 0, colIndex: 0, root: null }),
    columnCount: 3,
    gridId: "x",
    pos: { kind: "fax", colIndex: 0, rowIndex: 0, root: null } as any,
    active: rightCell,
    posElement: rightCell,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: true,
  });
});
