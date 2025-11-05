import { expect, test, vi } from "vitest";
import { getNearestRow } from "../get-nearest-row.js";

test("getNearestRow", async () => {
  const div = document.createElement("div");
  const row = document.createElement("div");
  const cell = document.createElement("div");
  cell.tabIndex = 0;
  cell.textContent = "bob";
  const child = document.createElement("div");
  child.textContent = "bob";
  cell.appendChild(child);
  row.appendChild(cell);
  div.appendChild(row);

  row.setAttribute("data-ln-row", "true");
  row.setAttribute("data-ln-gridid", "x");

  document.body.appendChild(div);

  await expect.element(getNearestRow("x", child)).toEqual(row);
  await expect.element(getNearestRow("x", row)).toEqual(row);

  cell.focus();
  await expect.element(cell).toHaveFocus();

  await expect.element(getNearestRow("x")).toEqual(row);
  row.setAttribute("data-ln-gridid", "y");
  await expect.element(getNearestRow("x")).toEqual(null);

  cell.blur();
  await expect.element(cell).not.toHaveFocus();
  vi.spyOn(document, "activeElement", "get").mockImplementationOnce(() => null);
  await expect.element(getNearestRow("x")).toEqual(null);
});
