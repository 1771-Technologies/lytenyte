import { expect, test } from "vitest";
import {
  queryCell,
  queryDetail,
  queryFirstFocusable,
  queryFloatingCell,
  queryFullWidthRow,
  queryHeader,
  queryHeaderCell,
  queryHeaderCellsAtRow,
} from "../query.js";

test("queryHeader should return the correct elements", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-header", "true");

  div.appendChild(x);

  document.body.appendChild(div);

  expect(queryHeader("x", div)).toEqual(x);
});

test("queryFirstFocusable", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-header-cell", "true");
  x.setAttribute("data-ln-colindex", "0");

  div.appendChild(x);

  document.body.appendChild(div);

  expect(queryFirstFocusable("x", div)).toEqual(x);
});

test("queryCell", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-cell", "true");
  x.setAttribute("data-ln-colindex", "0");
  x.setAttribute("data-ln-rowindex", "0");

  document.body.appendChild(div);
  document.body.appendChild(x);

  expect(queryCell("x", 0, 0, document.body)).toEqual(x);
  expect(queryCell("y", 0, 0, document.body)).toEqual(null);
});

test("queryFloatingCell", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-header-cell", "true");
  x.setAttribute("data-ln-header-floating", "true");
  x.setAttribute("data-ln-colindex", "1");
  div.appendChild(x);

  document.body.appendChild(div);
  expect(queryFloatingCell("x", 1, div)).toEqual(x);
});

test("queryFloatingCell", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-header-cell", "true");
  x.setAttribute("data-ln-colindex", "1");
  div.appendChild(x);

  document.body.appendChild(div);
  expect(queryHeaderCell("x", 1, div)).toEqual(x);
});

test("queryHeaderCellsAtRow", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-header-row-1", "true");
  div.appendChild(x);

  document.body.appendChild(div);
  expect(queryHeaderCellsAtRow("x", 1, div)).toEqual([x]);
});

test("queryDetail", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-rowindex", "1");
  x.setAttribute("data-ln-row-detail", "true");
  div.appendChild(x);

  document.body.appendChild(div);
  expect(queryDetail("x", 1, div)).toEqual(x);
});

test("queryFullWidthRow", () => {
  const div = document.createElement("div");
  const x = document.createElement("div");
  x.setAttribute("data-ln-gridid", "x");
  x.setAttribute("data-ln-rowindex", "1");
  x.setAttribute("data-ln-row", "true");
  x.setAttribute("data-ln-rowtype", "full-width");
  const alpha = document.createElement("div");
  x.appendChild(alpha);
  div.appendChild(x);

  document.body.appendChild(div);
  expect(queryFullWidthRow("x", 1, div)).toEqual(alpha);
});
