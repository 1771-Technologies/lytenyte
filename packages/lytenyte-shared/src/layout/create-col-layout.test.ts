import { describe, expect, test } from "vitest";
import { makeColumnView } from "../columns/index.js";
import { createColumnLayout } from "./create-col-layout.js";

describe("createColumnLayout", () => {
  test("Should return the correct column layout", () => {
    const view = makeColumnView({
      columns: [{ id: "x" }, { id: "y" }],
      base: {},
      filledDepth: false,
      groupExpansionDefault: false,
      groupExpansions: {},
      groupJoinDelimiter: ",",
      lastGroupShouldFill: false,
      marker: { on: false },
      rowGroupDepth: 0,
      rowGroupTemplate: {},
    });

    expect(createColumnLayout(view, false)).toMatchInlineSnapshot(`
      [
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 0,
            "id": "x",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 1,
            "id": "y",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
        ],
      ]
    `);
  });

  test("Should return the correct column layout when there are groups", () => {
    const view = makeColumnView({
      columns: [{ id: "x", groupPath: ["A"] }, { id: "y" }],
      base: {},
      filledDepth: false,
      groupExpansionDefault: false,
      groupExpansions: {},
      groupJoinDelimiter: ",",
      lastGroupShouldFill: false,
      marker: { on: false },
      rowGroupDepth: 0,
      rowGroupTemplate: {},
    });

    expect(createColumnLayout(view, false)).toMatchInlineSnapshot(`
      [
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 0,
            "columnIds": [
              "x",
            ],
            "end": 1,
            "groupPath": [
              "A",
            ],
            "id": "A",
            "idOccurrence": "A,0",
            "isCollapsible": false,
            "kind": "group",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "start": 0,
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 1,
            "id": "y",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 2,
            "rowStart": 0,
            "type": "string",
          },
        ],
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 0,
            "id": "x",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 1,
            "rowStart": 1,
            "type": "string",
          },
        ],
      ]
    `);
  });

  test("Should create the correct column layout when there are pinned columns", () => {
    const view = makeColumnView({
      columns: [{ id: "x", pin: "start" }, { id: "y", pin: "end" }, { id: "z" }],
      base: {},
      filledDepth: false,
      groupExpansionDefault: false,
      groupExpansions: {},
      groupJoinDelimiter: ",",
      lastGroupShouldFill: false,
      marker: { on: false },
      rowGroupDepth: 0,
      rowGroupTemplate: {},
    });

    expect(createColumnLayout(view, false)).toMatchInlineSnapshot(`
      [
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": true,
            "colPin": "start",
            "colSpan": 1,
            "colStart": 0,
            "id": "x",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 1,
            "id": "z",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 3,
            "colFirstEndPin": true,
            "colLastStartPin": undefined,
            "colPin": "end",
            "colSpan": 1,
            "colStart": 2,
            "id": "y",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
        ],
      ]
    `);
  });

  test("Should create the correct column layout when there are pinned groups rows", () => {
    const view = makeColumnView({
      columns: [
        { id: "x", groupPath: ["A"], pin: "end" },
        { id: "y", groupPath: ["B"], pin: "start" },
        { id: "z", groupPath: ["B"], pin: "start" },
        { id: "v" },
      ],
      base: {},
      filledDepth: false,
      groupExpansionDefault: false,
      groupExpansions: {},
      groupJoinDelimiter: ",",
      lastGroupShouldFill: false,
      marker: { on: false },
      rowGroupDepth: 0,
      rowGroupTemplate: {},
    });

    expect(createColumnLayout(view, false)).toMatchInlineSnapshot(`
      [
        [
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": true,
            "colPin": "start",
            "colSpan": 2,
            "colStart": 0,
            "columnIds": [
              "y",
              "z",
            ],
            "end": 2,
            "groupPath": [
              "B",
            ],
            "id": "B",
            "idOccurrence": "B,0",
            "isCollapsible": false,
            "kind": "group",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "start": 0,
          },
          {
            "colEnd": 3,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 2,
            "id": "v",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 2,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 4,
            "colFirstEndPin": true,
            "colLastStartPin": undefined,
            "colPin": "end",
            "colSpan": 1,
            "colStart": 3,
            "columnIds": [
              "x",
            ],
            "end": 1,
            "groupPath": [
              "A",
            ],
            "id": "A",
            "idOccurrence": "A,0",
            "isCollapsible": false,
            "kind": "group",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "start": 0,
          },
        ],
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": "start",
            "colSpan": 1,
            "colStart": 0,
            "id": "y",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 1,
            "rowStart": 1,
            "type": "string",
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": true,
            "colPin": "start",
            "colSpan": 1,
            "colStart": 1,
            "id": "z",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 1,
            "rowStart": 1,
            "type": "string",
          },
          {
            "colEnd": 4,
            "colFirstEndPin": true,
            "colLastStartPin": undefined,
            "colPin": "end",
            "colSpan": 1,
            "colStart": 3,
            "id": "x",
            "kind": "cell",
            "rowEnd": 2,
            "rowSpan": 1,
            "rowStart": 1,
            "type": "string",
          },
        ],
      ]
    `);
  });

  test("Should create the correct column layout when there are floating rows", () => {
    const view = makeColumnView({
      columns: [{ id: "x" }, { id: "y" }],
      base: {},
      filledDepth: false,
      groupExpansionDefault: false,
      groupExpansions: {},
      groupJoinDelimiter: ",",
      lastGroupShouldFill: false,
      marker: { on: false },
      rowGroupDepth: 0,
      rowGroupTemplate: {},
    });

    expect(createColumnLayout(view, true)).toMatchInlineSnapshot(`
      [
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 0,
            "id": "x",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 1,
            "id": "y",
            "kind": "cell",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
        ],
        [
          {
            "colEnd": 1,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 0,
            "id": "x",
            "kind": "floating",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
          {
            "colEnd": 2,
            "colFirstEndPin": undefined,
            "colLastStartPin": undefined,
            "colPin": null,
            "colSpan": 1,
            "colStart": 1,
            "id": "y",
            "kind": "floating",
            "rowEnd": 1,
            "rowSpan": 1,
            "rowStart": 0,
            "type": "string",
          },
        ],
      ]
    `);
  });
});
