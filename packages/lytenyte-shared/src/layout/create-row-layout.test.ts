import { describe, expect, test } from "vitest";
import { createRowLayout } from "./create-row-layout.js";
import type { LayoutRowWithCells } from "./types.js";

const rowByIndex = (r: number) => ({ id: `${r}` }) as any;
describe("createRowLayout", () => {
  test("Should create the correct layout", () => {
    const layouts = createRowLayout({
      startCutoff: 0,
      centerCutoff: 2,
      endCutoff: 2,
      rowCenterCutoff: 2,
      bottomCutoff: 2,
      topCutoff: 0,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: null,
      hasSpans: false,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex: (r) => ({ id: `${r}` }) as any,
      rowLookback: 10,
    });

    expect(layouts.layoutByIndex(0)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": false,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": null,
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 0,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 1,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": null,
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 0,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 1,
            "type": "string",
          },
        ],
        "id": "0",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });

  test("Should create the correct layout when there are row spans", () => {
    const layout = createRowLayout({
      startCutoff: 0,

      centerCutoff: 2,
      endCutoff: 2,
      topCutoff: 0,
      rowCenterCutoff: 4,
      bottomCutoff: 4,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r == 2 ? 4 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(2)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": false,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": null,
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 2,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": null,
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 2,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
        ],
        "id": "2",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 2,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });

  test("Should correctly row span over the top pinned area", () => {
    const layout = createRowLayout({
      startCutoff: 0,
      centerCutoff: 2,
      endCutoff: 0,
      topCutoff: 2,
      rowCenterCutoff: 5,
      bottomCutoff: 5,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r == 0 ? 4 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(0)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": true,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 0,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": "top",
            "rowSpan": 2,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 0,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": "top",
            "rowSpan": 2,
            "type": "string",
          },
        ],
        "id": "0",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
      }
    `);
  });

  test("Should correctly row span over the bottom pinned area", () => {
    const layout = createRowLayout({
      startCutoff: 0,
      centerCutoff: 2,
      endCutoff: 0,
      topCutoff: 2,
      rowCenterCutoff: 4,
      bottomCutoff: 8,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r == 6 ? 4 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(6)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": true,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 6,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 6,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
        ],
        "id": "6",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 6,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });

  test("Should correctly row span over a row cutoff area", () => {
    const layout = createRowLayout({
      startCutoff: 0,
      centerCutoff: 2,
      endCutoff: 0,
      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r == 4 ? 4 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(4)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": true,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 4,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 4,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
        ],
        "id": "4",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 4,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });

  test("Should correctly row span over a full width row area", () => {
    const layout = createRowLayout({
      startCutoff: 0,
      centerCutoff: 2,
      endCutoff: 0,
      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,
      columns: Array.from({ length: 2 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r === 3 ? 4 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(3)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": true,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 3,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
          {
            "colFirstEndPin": false,
            "colIndex": 1,
            "colLastStartPin": false,
            "colPin": "end",
            "colSpan": 1,
            "id": "1",
            "isDeadCol": false,
            "isDeadRow": false,
            "kind": "cell",
            "root": null,
            "rowFirstPinBottom": false,
            "rowIndex": 3,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 2,
            "type": "string",
          },
        ],
        "id": "3",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 3,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });

  test("Should correctly cell span over the start area", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 5,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 0 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[0]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 0,
        "colLastStartPin": false,
        "colPin": "start",
        "colSpan": 3,
        "id": "0",
        "isDeadCol": false,
        "isDeadRow": false,
        "kind": "cell",
        "root": null,
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[1]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 1,
        "colLastStartPin": false,
        "colPin": "start",
        "colSpan": 1,
        "id": "1",
        "isDeadCol": true,
        "isDeadRow": false,
        "kind": "cell",
        "root": {
          "colFirstEndPin": false,
          "colIndex": 0,
          "colLastStartPin": false,
          "colPin": "start",
          "colSpan": 3,
          "id": "0",
          "isDeadCol": false,
          "isDeadRow": false,
          "kind": "cell",
          "root": null,
          "rowFirstPinBottom": false,
          "rowIndex": 0,
          "rowIsFocusRow": false,
          "rowLastPinTop": false,
          "rowPin": "top",
          "rowSpan": 1,
          "type": "string",
        },
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[3]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 3,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 1,
        "id": "3",
        "isDeadCol": false,
        "isDeadRow": false,
        "kind": "cell",
        "root": null,
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
  });

  test("Should correctly cell span over the end area", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 4,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 6 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[6]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 6,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 2,
        "id": "6",
        "isDeadCol": false,
        "isDeadRow": false,
        "kind": "cell",
        "root": null,
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[7]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 7,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 1,
        "id": "7",
        "isDeadCol": true,
        "isDeadRow": false,
        "kind": "cell",
        "root": {
          "colFirstEndPin": false,
          "colIndex": 6,
          "colLastStartPin": false,
          "colPin": null,
          "colSpan": 2,
          "id": "6",
          "isDeadCol": false,
          "isDeadRow": false,
          "kind": "cell",
          "root": null,
          "rowFirstPinBottom": false,
          "rowIndex": 0,
          "rowIsFocusRow": false,
          "rowLastPinTop": false,
          "rowPin": "top",
          "rowSpan": 1,
          "type": "string",
        },
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
  });

  test("Should correctly cell span over the center area", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 5,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 3 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[3]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 3,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 2,
        "id": "3",
        "isDeadCol": false,
        "isDeadRow": false,
        "kind": "cell",
        "root": null,
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
    expect((layout.layoutByIndex(0) as LayoutRowWithCells).cells[4]).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 4,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 1,
        "id": "4",
        "isDeadCol": true,
        "isDeadRow": false,
        "kind": "cell",
        "root": {
          "colFirstEndPin": false,
          "colIndex": 3,
          "colLastStartPin": false,
          "colPin": null,
          "colSpan": 2,
          "id": "3",
          "isDeadCol": false,
          "isDeadRow": false,
          "kind": "cell",
          "root": null,
          "rowFirstPinBottom": false,
          "rowIndex": 0,
          "rowIsFocusRow": false,
          "rowLastPinTop": false,
          "rowPin": "top",
          "rowSpan": 1,
          "type": "string",
        },
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
  });

  test("Should correctly return the root cell for a spanning cell", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 5,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 3 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.rootCell(0, 22)).toMatchInlineSnapshot(`null`);
    expect(layout.rootCell(0, 4)).toMatchInlineSnapshot(`
      {
        "colFirstEndPin": false,
        "colIndex": 3,
        "colLastStartPin": false,
        "colPin": null,
        "colSpan": 2,
        "id": "3",
        "isDeadCol": false,
        "isDeadRow": false,
        "kind": "cell",
        "root": null,
        "rowFirstPinBottom": false,
        "rowIndex": 0,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": "top",
        "rowSpan": 1,
        "type": "string",
      }
    `);
  });

  test("Should correctly handle cached computations", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 5,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 3 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    layout.layoutByIndex(3);
    layout.layoutByIndex(3);
    layout.layoutByIndex(3);
  });

  test("Should correctly clear the cache", () => {
    const layout = createRowLayout({
      startCutoff: 3,
      centerCutoff: 5,
      endCutoff: 8,

      topCutoff: 2,
      rowCenterCutoff: 6,
      bottomCutoff: 8,

      columns: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: (_, c) => (c === 3 ? 4 : 1),
      computeRowSpan: null,
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: (r) => r === 5,
      rowByIndex,
      rowLookback: 10,
    });

    layout.layoutByIndex(2);
    layout.clearCache();
    layout.layoutByIndex(2);
  });

  test("Should handle row lookback correctly", () => {
    const layout = createRowLayout({
      startCutoff: 0,
      centerCutoff: 28,
      endCutoff: 30,

      topCutoff: 0,
      rowCenterCutoff: 28,
      bottomCutoff: 28,

      columns: Array.from({ length: 1 }, (_, i) => ({ id: `${i}` })),
      computeColSpan: null,
      computeRowSpan: (r) => (r === 2 ? 12 : 1),
      hasSpans: true,
      isCutoff: () => false,
      isFullWidth: () => false,
      rowByIndex,
      rowLookback: 10,
    });

    expect(layout.layoutByIndex(11)).toMatchInlineSnapshot(`
      {
        "cells": [
          {
            "colFirstEndPin": false,
            "colIndex": 0,
            "colLastStartPin": false,
            "colPin": null,
            "colSpan": 1,
            "id": "0",
            "isDeadCol": false,
            "isDeadRow": true,
            "kind": "cell",
            "root": {
              "colFirstEndPin": false,
              "colIndex": 0,
              "colLastStartPin": false,
              "colPin": null,
              "colSpan": 1,
              "id": "0",
              "isDeadCol": false,
              "isDeadRow": false,
              "kind": "cell",
              "root": null,
              "rowFirstPinBottom": false,
              "rowIndex": 2,
              "rowIsFocusRow": false,
              "rowLastPinTop": false,
              "rowPin": null,
              "rowSpan": 12,
              "type": "string",
            },
            "rowFirstPinBottom": false,
            "rowIndex": 2,
            "rowIsFocusRow": false,
            "rowLastPinTop": false,
            "rowPin": null,
            "rowSpan": 1,
            "type": "string",
          },
        ],
        "id": "11",
        "kind": "row",
        "rowFirstPinBottom": false,
        "rowIndex": 11,
        "rowIsFocusRow": false,
        "rowLastPinTop": false,
        "rowPin": null,
      }
    `);
  });
});
