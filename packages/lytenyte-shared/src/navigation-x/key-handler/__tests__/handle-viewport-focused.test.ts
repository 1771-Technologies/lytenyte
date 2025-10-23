import { expect, test, vi } from "vitest";
import { handleViewportFocused } from "../handle-viewport-focused.js";
import { wait } from "../../../js-utils/sleep.js";

test("handleViewportFocused should correctly focus the right cells", async () => {
  const viewport = document.createElement("div");
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-cell", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-colindex", "0");
  cell.setAttribute("data-ln-rowindex", "0");
  cell.tabIndex = 0;

  viewport.appendChild(cell);
  viewport.tabIndex = 0;

  document.body.appendChild(viewport);

  viewport.focus();
  await expect.element(viewport).toHaveFocus();

  const before = vi.fn();
  const after = vi.fn();
  handleViewportFocused({
    beforeKey: before,
    afterKey: after,
    gridId: "x",
    scrollIntoView: () => {},
    viewport,
  });

  await expect.element(cell).toHaveFocus();

  viewport.focus();
  await expect.element(viewport).toHaveFocus();

  cell.remove();
  handleViewportFocused({
    beforeKey: before,
    afterKey: after,
    gridId: "x",
    scrollIntoView: () => {},
    viewport,
  });
  await wait();
  await expect.element(viewport).toHaveFocus();

  handleViewportFocused({
    beforeKey: before,
    afterKey: after,
    gridId: "x",
    scrollIntoView: () => {},
    viewport,
  });
  wait();
  viewport.appendChild(cell);
  await expect.element(cell).toHaveFocus();

  const header = document.createElement("div");
  header.setAttribute("data-ln-header", "true");
  header.setAttribute("data-ln-gridid", "x");
  viewport.appendChild(header);

  cell.remove();
  viewport.focus();
  await expect.element(viewport).toHaveFocus();

  handleViewportFocused({
    beforeKey: before,
    afterKey: after,
    gridId: "x",
    scrollIntoView: () => {},
    viewport,
  });
  await expect.element(viewport).toHaveFocus();
});
