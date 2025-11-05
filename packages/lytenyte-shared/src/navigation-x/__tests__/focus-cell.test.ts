import { expect, test, vi } from "vitest";
import { focusCell } from "../focus-cell.js";

test("focusCell", async () => {
  const scrollIntoView = vi.fn();

  focusCell({
    scrollIntoView,
    vp: null,
    rowIndex: 0,
    colIndex: 0,
    getRootCell: () => null,
    focusActive: { get: () => null, set: () => {} },
    id: "x",
    postFocus: () => {},
  });

  expect(scrollIntoView).toHaveBeenCalledOnce();

  const x = document.createElement("div");
  x.setAttribute("data-ln-cell", "true");
  x.setAttribute("data-ln-rowindex", "0");
  x.setAttribute("data-ln-colindex", "0");
  x.setAttribute("data-ln-gridid", "x");
  x.tabIndex = 0;

  document.body.appendChild(x);

  const setter = vi.fn((n) => n());
  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => null,
    id: "x",
  });

  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "cell", colIndex: 0, rowIndex: 0, root: null }),
    id: "x",
    postFocus: () => {},
  });
  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "cell", colIndex: 0, rowIndex: 0, root: null }),
    id: "x",
  });

  await expect.element(x).toHaveFocus();

  x.remove();
  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "cell", colIndex: 0, rowIndex: 0, root: null }),
    id: "x",
  });

  const y = document.createElement("div");
  y.setAttribute("data-ln-rowindex", "0");
  y.setAttribute("data-ln-row", "true");
  y.setAttribute("data-ln-rowtype", "full-width");
  y.setAttribute("data-ln-gridid", "x");
  const child = document.createElement("div");
  child.innerText = "x";
  child.tabIndex = 0;
  y.appendChild(child);
  document.body.appendChild(y);

  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "full-width", rowIndex: 0, colIndex: 0 }),
    id: "x",
  });
  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "full-width", rowIndex: 0, colIndex: 0 }),
    id: "x",
    postFocus: () => {},
  });
  await expect.element(child).toHaveFocus();

  child.remove();
  focusCell({
    scrollIntoView,
    vp: document.body,
    colIndex: 0,
    rowIndex: 0,
    focusActive: { get: () => null, set: setter },
    getRootCell: () => ({ kind: "full-width", rowIndex: 0, colIndex: 0 }),
    id: "x",
    postFocus: () => {},
  });
});
