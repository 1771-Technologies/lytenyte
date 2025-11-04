import { expect, test } from "vitest";
import { positionsEqual } from "../positions-equal.js";

test("positionsEqual should handle cells", () => {
  expect(
    positionsEqual(
      { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
      { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
    ),
  ).toEqual(true);

  expect(
    positionsEqual(
      {
        kind: "cell",
        rowIndex: 1,
        colIndex: 1,
        root: { colIndex: 1, colSpan: 2, rowIndex: 1, rowSpan: 3 },
      },
      { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
    ),
  ).toEqual(false);

  expect(
    positionsEqual(
      {
        kind: "cell",
        rowIndex: 1,
        colIndex: 1,
        root: { colIndex: 1, colSpan: 2, rowIndex: 1, rowSpan: 3 },
      },
      {
        kind: "cell",
        rowIndex: 2,
        colIndex: 1,
        root: { colIndex: 1, colSpan: 2, rowIndex: 1, rowSpan: 3 },
      },
    ),
  ).toEqual(true);
});

test("positionEqual should handle full-width rows", () => {
  expect(
    positionsEqual(
      { kind: "full-width", rowIndex: 1, colIndex: 0 },
      { kind: "full-width", rowIndex: 1, colIndex: 0 },
    ),
  ).toEqual(true);

  expect(
    positionsEqual(
      { kind: "full-width", rowIndex: 1, colIndex: 0 },
      { kind: "full-width", rowIndex: 1, colIndex: 2 },
    ),
  ).toEqual(true);

  expect(
    positionsEqual(
      { kind: "full-width", rowIndex: 2, colIndex: 0 },
      { kind: "full-width", rowIndex: 1, colIndex: 2 },
    ),
  ).toEqual(false);
  expect(positionsEqual({ kind: "full-width", rowIndex: 2, colIndex: 0 }, null)).toEqual(false);
});

test("positionEqual should handle detail rows", () => {
  expect(
    positionsEqual(
      { kind: "detail", rowIndex: 1, colIndex: 0 },
      { kind: "detail", rowIndex: 1, colIndex: 0 },
    ),
  ).toEqual(true);

  expect(
    positionsEqual(
      { kind: "detail", rowIndex: 1, colIndex: 0 },
      { kind: "detail", rowIndex: 1, colIndex: 2 },
    ),
  ).toEqual(true);

  expect(
    positionsEqual(
      { kind: "detail", rowIndex: 2, colIndex: 0 },
      { kind: "detail", rowIndex: 1, colIndex: 2 },
    ),
  ).toEqual(false);

  expect(positionsEqual({ kind: "detail", rowIndex: 2, colIndex: 0 }, null)).toEqual(false);
});

test("positionEqual should handle header cell types", () => {
  expect(
    positionsEqual({ kind: "header-cell", colIndex: 0 }, { kind: "header-cell", colIndex: 0 }),
  ).toEqual(true);
  expect(
    positionsEqual({ kind: "header-cell", colIndex: 1 }, { kind: "header-cell", colIndex: 0 }),
  ).toEqual(false);
  expect(positionsEqual({ kind: "header-cell", colIndex: 1 }, null)).toEqual(false);
});
