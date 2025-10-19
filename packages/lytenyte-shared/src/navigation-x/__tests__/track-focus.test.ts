import { expect, test } from "vitest";
import type { PositionUnion } from "../../+types";
import { trackFocus } from "../track-focus.js";
import { userEvent } from "@vitest/browser/context";
import { wait } from "../../js-utils/index.js";

// -- Write tests for this
test("focus tracker should maintain tracking position", async () => {
  const position: { current: PositionUnion | null } = { current: null };
  const elementFocused: { current: boolean } = { current: false };
  const hasFocus: { current: boolean } = { current: false };

  const viewport = document.createElement("div");
  const cell = document.createElement("div");
  cell.tabIndex = 0;
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-cell", "true");
  cell.setAttribute("data-ln-rowindex", "1");
  cell.setAttribute("data-ln-colindex", "1");
  cell.setAttribute("data-ln-rowspan", "1");
  cell.setAttribute("data-ln-colspan", "1");

  const cell2 = document.createElement("div");
  cell2.tabIndex = 0;
  cell2.setAttribute("data-ln-gridid", "y");
  cell2.setAttribute("data-ln-cell", "true");
  cell2.setAttribute("data-ln-rowindex", "1");
  cell2.setAttribute("data-ln-colindex", "1");
  cell2.setAttribute("data-ln-rowspan", "1");
  cell2.setAttribute("data-ln-colspan", "1");

  viewport.tabIndex = 0;
  viewport.appendChild(cell);
  viewport.appendChild(cell2);

  const inputA = document.createElement("input");
  const inputB = document.createElement("input");
  document.body.append(inputA);
  document.body.append(viewport);
  document.body.append(inputB);

  const focus = {
    get: () => position.current,
    set: (p: PositionUnion | null | ((p: PositionUnion | null) => PositionUnion | null)) => {
      const next = typeof p === "function" ? p(position.current) : p;

      position.current = next;
    },
  };

  const clean = trackFocus({
    gridId: "x",
    element: viewport,
    focusActive: focus,
    onHasFocusChange: (c) => {
      hasFocus.current = c;
    },
    onElementFocused: (c) => {
      elementFocused.current = c;
    },
  });

  expect(position.current).toEqual(null);
  expect(hasFocus.current).toEqual(false);

  inputA.focus();
  await expect.element(inputA).toHaveFocus();

  await userEvent.keyboard("{Tab}");
  await expect.element(viewport).toHaveFocus();
  expect(hasFocus.current).toEqual(false);
  expect(elementFocused.current).toEqual(true);
  expect(position.current).toEqual(null);

  await userEvent.keyboard("{Tab}");
  await expect.element(cell).toHaveFocus();
  expect(hasFocus.current).toEqual(true);
  expect(elementFocused.current).toEqual(false);
  expect(position.current?.kind).toEqual("cell");

  await userEvent.keyboard("{Tab}");
  await expect.element(cell2).toHaveFocus();
  expect(hasFocus.current).toEqual(false);
  expect(elementFocused.current).toEqual(false);
  expect(position.current).toEqual(null);

  await userEvent.keyboard("{Tab}");
  await expect.element(inputB).toHaveFocus();
  expect(hasFocus.current).toEqual(false);
  expect(elementFocused.current).toEqual(false);
  expect(position.current).toEqual(null);

  cell.focus();
  await expect.element(cell).toHaveFocus();
  expect(hasFocus.current).toEqual(true);
  expect(elementFocused.current).toEqual(false);
  expect(position.current?.kind).toEqual("cell");

  const original = document.hasFocus;
  document.hasFocus = () => false;
  cell.blur();
  await wait();
  document.hasFocus = original;
  expect(hasFocus.current).toEqual(true);
  expect(elementFocused.current).toEqual(false);
  expect(position.current?.kind).toEqual("cell");

  cell.focus();
  await expect.element(cell).toHaveFocus();
  cell.blur();

  clean();

  cell.focus();
  await expect.element(cell).toHaveFocus();
  expect(hasFocus.current).toEqual(false);
  expect(elementFocused.current).toEqual(false);
  expect(position.current).toEqual(null);
});
