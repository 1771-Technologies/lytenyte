import { describe, expect, test } from "vitest";
import { makeColumnView } from "../make-column-view";

describe("makeColumnView", () => {
  test("should create a basic column view", () => {
    const columns = [{ id: "x" }, { id: "y" }];
    const base = {};

    const view = makeColumnView({
      columns,
      base,
      groupExpansionDefault: true,
      groupJoinDelimiter: "/",
      groupExpansions: {},
    });

    expect(view.visibleColumns).toEqual(columns);
    expect(view.combinedView).toMatchInlineSnapshot(`
      [
        [
          {
            "colSpan": 1,
            "colStart": 0,
            "data": {
              "id": "x",
            },
            "kind": "leaf",
            "rowSpan": 1,
            "rowStart": 0,
          },
          {
            "colSpan": 1,
            "colStart": 1,
            "data": {
              "id": "y",
            },
            "kind": "leaf",
            "rowSpan": 1,
            "rowStart": 0,
          },
        ],
      ]
    `);
    expect(view.maxRow).toEqual(1);
    expect(view.startCount).toEqual(0);
    expect(view.centerCount).toEqual(2);
    expect(view.endCount).toEqual(0);
  });
});
