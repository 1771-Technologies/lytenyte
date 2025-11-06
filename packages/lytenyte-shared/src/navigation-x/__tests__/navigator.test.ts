import { expect, test, vi } from "vitest";
import { navigator } from "../navigator.js";
import type { PositionUnion } from "../../+types.js";
import { wait } from "../../js-utils/sleep.js";

test("navigator coverage check", async () => {
  const viewport = document.createElement("div");
  viewport.tabIndex = 0;
  viewport.setAttribute("data-ln-gridid", "x");

  const cell = document.createElement("div");
  cell.setAttribute("data-ln-cell", "true");
  cell.setAttribute("data-ln-rowindex", "0");
  cell.setAttribute("data-ln-colindex", "0");
  cell.setAttribute("data-ln-gridid", "x");
  cell.tabIndex = 0;

  viewport.appendChild(cell);
  document.body.appendChild(viewport);

  cell.focus();
  await expect.element(cell).toHaveFocus();

  let pos: PositionUnion | null = null;
  const get = () => pos;
  const set = (p: PositionUnion | null | ((p: PositionUnion | null) => PositionUnion | null)) => {
    if (typeof p === "function") pos = p(pos);
    else pos = p;
  };

  const nav = navigator({
    viewport,
    scrollIntoView: vi.fn(),
    rowCount: 2,
    columnCount: 3,
    isRowDetailExpanded: () => false,
    position: { get, set },
    gridId: "x",
    getRootCell: () => null,

    downKey: "ArrowDown",
    nextKey: "ArrowRight",
    prevKey: "ArrowLeft",
    upKey: "ArrowUp",
    pageDownKey: "PageDown",
    pageUpKey: "PageUp",
    homeKey: "Home",
    endKey: "End",
  });

  nav({
    key: "Tab",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  await wait();
  nav({
    key: "ArrowDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "ArrowRight",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "ArrowLeft",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "ArrowDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "ArrowUp",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "End",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "Home",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  pos = { kind: "header-cell", colIndex: 0 };
  nav({
    key: "PageDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "PageDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  pos = { kind: "cell", rowIndex: 0, colIndex: 0, root: null };
  nav({
    key: "PageUp",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  viewport.focus();
  await expect.element(viewport).toHaveFocus();
  nav({
    key: "ArrowRight",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
  viewport.focus();
  await expect.element(viewport).toHaveFocus();
  nav({
    key: "ArrowDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  viewport.focus();
  await expect.element(viewport).toHaveFocus();
  nav({
    key: "ArrowUp",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  viewport.remove();
  const nestedViewport = document.createElement("div");
  nestedViewport.appendChild(viewport);
  nestedViewport.setAttribute("data-ln-gridid", "y");
  document.body.append(nestedViewport);

  viewport.focus();
  await expect.element(viewport).toHaveFocus();

  nav({
    key: "ArrowDown",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });

  nav({
    key: "X",
    ctrlKey: false,
    metaKey: false,
    preventDefault: () => {},
    stopPropagation: () => {},
  });
});
