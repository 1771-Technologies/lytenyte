import { describe, expect, test } from "vitest";
import { makeColumnGroupMetadata, type PartialColumns } from "../make-column-group-metadata.js";
import { getVisibleColumnsWithGroups } from "../get-visible-columns-with-groups.js";

describe("getVisibleColumnsWithGroups", () => {
  test("should return the correct values when a group is expanded", () => {
    const columns: PartialColumns[] = [
      { id: "x", groupPath: ["A"], groupVisibility: "close" },
      { id: "xy", groupPath: ["A"], groupVisibility: "open" },
    ];

    const meta = makeColumnGroupMetadata(columns, "#");

    expect(getVisibleColumnsWithGroups(columns, meta, {}, true)).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "A",
          ],
          "groupVisibility": "open",
          "id": "xy",
        },
      ]
    `);
  });

  test("should return the correct values when a group is collapsed", () => {
    const columns: PartialColumns[] = [
      { id: "x", groupPath: ["A"], groupVisibility: "close" },
      { id: "xy", groupPath: ["A"], groupVisibility: "open" },
    ];

    const meta = makeColumnGroupMetadata(columns, "#");

    expect(getVisibleColumnsWithGroups(columns, meta, { A: false }, true)).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "A",
          ],
          "groupVisibility": "close",
          "id": "x",
        },
      ]
    `);
  });

  test("should return the correct values when a group should always be visible", () => {
    const columns: PartialColumns[] = [
      { id: "x", groupPath: ["A"], groupVisibility: "close" },
      { id: "xy", groupPath: ["A"], groupVisibility: "open" },
      { id: "t", groupPath: ["A"], groupVisibility: "always" },
      { id: "v" },
    ];

    const meta = makeColumnGroupMetadata(columns, "#");

    expect(getVisibleColumnsWithGroups(columns, meta, { A: false }, true)).toMatchInlineSnapshot(
      `
      [
        {
          "groupPath": [
            "A",
          ],
          "groupVisibility": "close",
          "id": "x",
        },
        {
          "groupPath": [
            "A",
          ],
          "groupVisibility": "always",
          "id": "t",
        },
        {
          "id": "v",
        },
      ]
    `,
    );
  });
});
