import { describe, expect, test } from "vitest";
import type { RowSelectionState } from "../types.js";
import { rowSelectLinkWithParents } from "./row-select-link-with-parents.js";

describe("rowSelectLinkWithParents", () => {
  test("Should return the row selection links with parents", () => {
    const state: RowSelectionState = {
      kind: "linked",
      selected: false,
      children: new Map([["Alpha", { id: "x", children: new Map([["#", { id: "c", selected: false }]]) }]]),
    };

    const result = rowSelectLinkWithParents(state);

    expect(result).toMatchInlineSnapshot(`
      {
        "children": Map {
          "Alpha" => {
            "children": Map {
              "#" => {
                "id": "c",
                "parent": [Circular],
                "selected": false,
              },
            },
            "id": "x",
            "parent": [Circular],
          },
        },
        "kind": "linked",
        "selected": false,
      }
    `);
  });

  test("Should return empty linked when provided isolated", () => {
    const state: RowSelectionState = {
      kind: "isolated",
      selected: false,
      exceptions: new Set(),
    };

    const result = rowSelectLinkWithParents(state);

    expect(result).toMatchInlineSnapshot(`
      {
        "children": Map {},
        "kind": "linked",
        "selected": false,
      }
    `);
  });
});
