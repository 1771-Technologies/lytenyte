import { expect, test } from "vitest";
import { cellEqual } from "../cell-equal.js";

test("cellEqual should return the correct value", () => {
  expect(
    cellEqual(
      { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
      { kind: "cell", rowIndex: 2, colIndex: 1, root: null },
    ),
  ).toEqual(true);

  expect(
    cellEqual(
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
    cellEqual(
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
