import { expect, test } from "vitest";
import { nearestFocusable } from "../nearest-focusable.js";

test("nearest focusable should return the correct focusable cell", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-cell", "true");
  cell.setAttribute("data-ln-gridid", "x");

  const child1 = document.createElement("div");
  cell.appendChild(child1);

  expect(nearestFocusable("x", child1)).toEqual(cell);
});

test("nearest focusable should return the correct focusable detail", () => {
  const detail = document.createElement("div");
  detail.setAttribute("data-ln-row-detail", "true");
  detail.setAttribute("data-ln-gridid", "x");

  const child1 = document.createElement("div");
  detail.appendChild(child1);

  expect(nearestFocusable("x", child1)).toEqual(detail);
});

test("nearest focusable should return the correct focusable floating", () => {
  const floating = document.createElement("div");
  floating.setAttribute("data-ln-header-cell", "true");
  floating.setAttribute("data-ln-header-floating", "true");
  floating.setAttribute("data-ln-gridid", "x");

  const child1 = document.createElement("div");
  floating.appendChild(child1);

  expect(nearestFocusable("x", child1)).toEqual(floating);
});

test("nearest focusable should return the correct focusable header", () => {
  const header = document.createElement("div");
  header.setAttribute("data-ln-header-cell", "true");
  header.setAttribute("data-ln-gridid", "x");

  const child1 = document.createElement("div");
  header.appendChild(child1);

  expect(nearestFocusable("x", child1)).toEqual(header);
});

test("nearest focusable should return the correct focusable header group", () => {
  const group = document.createElement("div");
  group.setAttribute("data-ln-header-group", "true");
  group.setAttribute("data-ln-gridid", "x");

  const child1 = document.createElement("div");
  group.appendChild(child1);

  expect(nearestFocusable("x", child1)).toEqual(group);
});
