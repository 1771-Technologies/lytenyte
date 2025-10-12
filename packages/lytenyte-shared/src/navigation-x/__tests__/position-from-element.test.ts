import { expect, test } from "vitest";
import { positionFromElement } from "../position-from-element.js";

test("position from element for cell", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-cell", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-rowindex", "2");
  cell.setAttribute("data-ln-colindex", "1");
  cell.setAttribute("data-ln-colspan", "1");
  cell.setAttribute("data-ln-rowspan", "1");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 1,
      "kind": "cell",
      "root": {
        "colIndex": 1,
        "colSpan": 1,
        "rowIndex": 2,
        "rowSpan": 1,
      },
      "rowIndex": 2,
    }
  `);
});

test("position from element for detail", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-row-detail", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-rowindex", "2");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 0,
      "kind": "detail",
      "rowIndex": 2,
    }
  `);
});

test("position from element for full width", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-rowtype", "full-width");
  cell.setAttribute("data-ln-row", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-rowindex", "2");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 0,
      "kind": "full-width",
      "rowIndex": 2,
    }
  `);
});

test("position from element for header cell", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-header-cell", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-colindex", "2");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 2,
      "kind": "header-cell",
    }
  `);
});

test("position from element for floating cell", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-header-cell", "true");
  cell.setAttribute("data-ln-header-floating", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-colindex", "2");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 2,
      "kind": "floating-cell",
    }
  `);
});

test("position from element for floating header group", () => {
  const cell = document.createElement("div");
  cell.setAttribute("data-ln-header-group", "true");
  cell.setAttribute("data-ln-gridid", "x");
  cell.setAttribute("data-ln-rowindex", "2");
  cell.setAttribute("data-ln-colindex", "1");
  cell.setAttribute("data-ln-colspan", "1");

  expect(positionFromElement("x", cell)).toMatchInlineSnapshot(`
    {
      "colIndex": 1,
      "columnEndIndex": 2,
      "columnStartIndex": 1,
      "hierarchyRowIndex": 2,
      "kind": "header-group-cell",
    }
  `);
});
