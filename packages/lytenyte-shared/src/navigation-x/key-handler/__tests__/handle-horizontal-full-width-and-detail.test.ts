import { expect, test, vi } from "vitest";
import { handleHorizontal } from "../handle-horizontal.js";

test("handleHorizontal should handle full-width rows", async () => {
  const full = document.createElement("div");
  const a = document.createElement("button");
  a.tabIndex = 0;
  const b = document.createElement("button");
  b.tabIndex = 0;
  const c = document.createElement("button");
  c.tabIndex = 0;

  const cell = document.createElement("div");
  cell.tabIndex = 0;

  cell.appendChild(a);
  cell.appendChild(b);
  cell.appendChild(c);

  full.appendChild(cell);

  const viewport = document.createElement("div");
  viewport.appendChild(full);

  document.body.appendChild(viewport);

  full.setAttribute("data-ln-row", "true");
  full.setAttribute("data-ln-rowtype", "full-width");
  full.setAttribute("data-ln-gridid", "x");

  cell.focus();
  await expect.element(cell).toHaveFocus();

  const setter = vi.fn((fn) => fn({}));
  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "full-width", colIndex: 1, rowIndex: 0 },
    active: cell,
    posElement: full,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(a).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "full-width", colIndex: 1, rowIndex: 0 },
    active: a,
    posElement: full,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(b).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "full-width", colIndex: 1, rowIndex: 0 },
    active: b,
    posElement: full,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(a).toHaveFocus();
});

test("handleHorizontal should handle detail rows", async () => {
  const detail = document.createElement("div");
  const a = document.createElement("button");
  a.tabIndex = 0;
  const b = document.createElement("button");
  b.tabIndex = 0;
  const c = document.createElement("button");
  c.tabIndex = 0;

  detail.appendChild(a);
  detail.appendChild(b);
  detail.appendChild(c);

  const viewport = document.createElement("div");
  viewport.appendChild(detail);

  document.body.appendChild(viewport);

  detail.setAttribute("data-ln-row-detail", "true");
  detail.setAttribute("data-ln-gridid", "x");

  detail.tabIndex = 0;
  detail.focus();
  await expect.element(detail).toHaveFocus();

  const setter = vi.fn((fn) => fn({}));
  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "detail", colIndex: 1, rowIndex: 0 },
    active: detail,
    posElement: detail,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(a).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: false,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "detail", colIndex: 1, rowIndex: 0 },
    active: a,
    posElement: detail,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(b).toHaveFocus();

  handleHorizontal({
    viewport,
    isBack: true,
    scrollIntoView: () => {},
    getRootCell: () => null,
    columnCount: 3,
    gridId: "x",
    pos: { kind: "detail", colIndex: 1, rowIndex: 0 },
    active: b,
    posElement: detail,
    cp: { get: () => null as any, set: setter },
    done: () => {},
    modified: false,
  });

  await expect.element(a).toHaveFocus();
});
