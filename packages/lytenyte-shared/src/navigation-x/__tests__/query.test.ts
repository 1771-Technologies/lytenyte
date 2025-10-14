import { expect, test } from "vitest";
import { queryFirstFocusable, queryHeader } from "../query.js";

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
