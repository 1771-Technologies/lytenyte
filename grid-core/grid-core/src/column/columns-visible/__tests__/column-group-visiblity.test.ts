import { columnsGroupVisibility } from "../columns-group-visibility.js";
import type { ColumnLike } from "../columns-visible.js";

describe("basic visibility", () => {
  test("should handle an empty array", () => {
    expect(columnsGroupVisibility([], () => false, "/")).toMatchInlineSnapshot(`[]`);
  });

  test("should handle an array with no group columns", () => {
    expect(columnsGroupVisibility([{ id: "x" }, { id: "z" }], () => false, "/"))
      .toMatchInlineSnapshot(`
      [
        {
          "id": "x",
        },
        {
          "id": "z",
        },
      ]
    `);
  });

  test("should handle a single column", () => {
    expect(columnsGroupVisibility([{ id: "x", groupPath: ["alpha"] }], () => false, "/"))
      .toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "alpha",
          ],
          "id": "x",
        },
      ]
    `);
  });
  test("should handle multiple columns", () => {
    expect(
      columnsGroupVisibility(
        [
          { id: "x", group: ["a"] },
          { id: "z", group: ["a"] },
        ],
        () => false,
        "/",
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "group": [
            "a",
          ],
          "id": "x",
        },
        {
          "group": [
            "a",
          ],
          "id": "z",
        },
      ]
    `);
  });

  test("should handle a mixed group of columns and non-group columns", () => {
    expect(
      columnsGroupVisibility(
        [
          { id: "x", groupPath: ["a"] },
          { id: "z", groupPath: [] },
          { id: "t", groupPath: ["v"] },
        ],
        () => false,
        "/",
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "id": "x",
        },
        {
          "groupPath": [],
          "id": "z",
        },
        {
          "groupPath": [
            "v",
          ],
          "id": "t",
        },
      ]
    `);
  });
});

describe("Group Visibility Rules", () => {
  test("should handle always visible", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "always-visible" },
      { id: "y", groupPath: ["a"] },
      { id: "v", groupPath: ["a"] },
      { id: "ty", groupPath: ["a"] },
      { id: "z", groupPath: ["a"], groupVisibility: "always-visible" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "x",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "z",
        },
      ]
    `);

    expect(columnsGroupVisibility(columns, () => false, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "x",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "y",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "v",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "ty",
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "z",
        },
      ]
    `);
  });

  test("should handle visible when closed", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "visible-when-closed" },
      { id: "y", groupPath: ["a"] },
      { id: "z", groupPath: ["a"] },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "visible-when-closed",
          "id": "x",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
      ]
    `);

    expect(columnsGroupVisibility(columns, () => false, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "id": "y",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "z",
        },
      ]
    `);
  });
});

describe("Nested Groups", () => {
  test("should handle nested groups with different collapse states", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a", "b", "c"], groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a", "b"], groupVisibility: "visible-when-closed" },
      { id: "z", groupPath: ["a"], groupVisibility: "always-visible" },
    ];

    const isGroupCollapsed = (path: string) => path === "a/b";

    expect(columnsGroupVisibility(columns, isGroupCollapsed, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
            "b",
          ],
          "id": "lytenyte-empty:a|>b|>empty-0",
          "pin": undefined,
        },
        {
          "groupPath": [
            "a",
            "b",
          ],
          "groupVisibility": "visible-when-closed",
          "id": "y",
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "z",
        },
      ]
    `);
  });

  test("should handle multiple nested groups at same level", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a", "b1"], groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a", "b2"], groupVisibility: "visible-when-open" },
      { id: "z", groupPath: ["a", "b3"], groupVisibility: "visible-when-open" },
    ];

    const isGroupCollapsed = (path: string) => path === "a/b1" || path === "a/b3";

    expect(columnsGroupVisibility(columns, isGroupCollapsed, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>b1|>empty-0",
          "pin": undefined,
        },
        {
          "groupPath": [
            "a",
            "b2",
          ],
          "groupVisibility": "visible-when-open",
          "id": "y",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>b3|>empty-1",
          "pin": undefined,
        },
      ]
    `);
  });
});

describe("Pin Behavior", () => {
  test("should maintain pin boundaries when collapsing", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], pin: "start" },
      { id: "y", groupPath: ["a"], pin: null },
      { id: "z", groupPath: ["a"], pin: "end" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptystart-0",
          "pin": "start",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": null,
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptyend-0",
          "pin": "end",
        },
      ]
    `);
  });

  test("should handle mixed pin types in same group", () => {
    const columns: ColumnLike[] = [
      { id: "x1", groupPath: ["a"], pin: "start" },
      { id: "x2", groupPath: ["a"], pin: "start" },
      { id: "y1", groupPath: ["a"], pin: null },
      { id: "y2", groupPath: ["a"], pin: null },
      { id: "z1", groupPath: ["a"], pin: "end" },
      { id: "z2", groupPath: ["a"], pin: "end" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptystart-0",
          "pin": "start",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": null,
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptyend-0",
          "pin": "end",
        },
      ]
    `);
  });

  test("should handle empty columns across pin boundaries", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], pin: "start", groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a"], pin: null, groupVisibility: "visible-when-open" },
      { id: "z", groupPath: ["a"], pin: "end", groupVisibility: "visible-when-open" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptystart-0",
          "pin": "start",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": null,
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptyend-0",
          "pin": "end",
        },
      ]
    `);
  });
});

describe("Empty Column Handling", () => {
  test("should collapse adjacent empty columns in same group", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a"], groupVisibility: "visible-when-open" },
      { id: "z", groupPath: ["a"], groupVisibility: "visible-when-open" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
      ]
    `);
  });

  test("should handle empty columns at different group levels", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a", "b"], groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a"], groupVisibility: "visible-when-open" },
    ];

    const isGroupCollapsed = (path: string) => path === "a" || path === "a/b";

    expect(columnsGroupVisibility(columns, isGroupCollapsed, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
      ]
    `);
  });
});

describe("Edge Cases", () => {
  test("should handle undefined groupPath", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupVisibility: "visible-when-open" },
      { id: "y", groupPath: undefined, groupVisibility: "visible-when-closed" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupVisibility": "visible-when-open",
          "id": "x",
        },
        {
          "groupPath": undefined,
          "groupVisibility": "visible-when-closed",
          "id": "y",
        },
      ]
    `);
  });

  test("should handle groups with no visible columns", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "visible-when-open" },
      { id: "y", groupPath: ["a"], groupVisibility: "visible-when-open" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
      ]
    `);
  });

  test("should handle all columns hidden", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "visible-when-closed" },
      { id: "y", groupPath: ["b"], groupVisibility: "visible-when-closed" },
    ];

    expect(columnsGroupVisibility(columns, () => false, "/")).toMatchInlineSnapshot(`[]`);
  });
});

describe("Complex Scenarios", () => {
  test("should handle mixed visibility rules in same group", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a"], groupVisibility: "always-visible" },
      { id: "y", groupPath: ["a"], groupVisibility: "visible-when-closed" },
      { id: "z", groupPath: ["a"], groupVisibility: "visible-when-open" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "x",
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "visible-when-closed",
          "id": "y",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
      ]
    `);
  });

  test("should handle complex nested groups with mixed visibility", () => {
    const columns: ColumnLike[] = [
      { id: "x1", groupPath: ["a", "b", "c"], groupVisibility: "always-visible" },
      { id: "x2", groupPath: ["a", "b"], groupVisibility: "visible-when-closed" },
      { id: "y1", groupPath: ["a", "b", "c"], groupVisibility: "visible-when-open" },
      { id: "y2", groupPath: ["a", "b"], groupVisibility: "visible-when-open" },
      { id: "z1", groupPath: ["a"], groupVisibility: "always-visible" },
    ];

    const isGroupCollapsed = (path: string) => path === "a/b";

    expect(columnsGroupVisibility(columns, isGroupCollapsed, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
            "b",
            "c",
          ],
          "groupVisibility": "always-visible",
          "id": "x1",
        },
        {
          "groupPath": [
            "a",
            "b",
          ],
          "groupVisibility": "visible-when-closed",
          "id": "x2",
        },
        {
          "groupPath": [
            "a",
            "b",
          ],
          "id": "lytenyte-empty:a|>b|>empty-0",
          "pin": undefined,
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "always-visible",
          "id": "z1",
        },
      ]
    `);
  });

  test("should handle complex pin and visibility combinations", () => {
    const columns: ColumnLike[] = [
      { id: "x1", groupPath: ["a", "b"], pin: "start", groupVisibility: "always-visible" },
      { id: "x2", groupPath: ["a"], pin: "start", groupVisibility: "visible-when-closed" },
      { id: "y1", groupPath: ["a", "b"], pin: null, groupVisibility: "visible-when-open" },
      { id: "y2", groupPath: ["a"], pin: null, groupVisibility: "visible-when-open" },
      { id: "z1", groupPath: ["a", "b"], pin: "end", groupVisibility: "always-visible" },
      { id: "z2", groupPath: ["a"], pin: "end", groupVisibility: "visible-when-closed" },
    ];

    const isGroupCollapsed = (path: string) => path === "a/b";

    expect(columnsGroupVisibility(columns, isGroupCollapsed, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
            "b",
          ],
          "groupVisibility": "always-visible",
          "id": "x1",
          "pin": "start",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>b|>empty-0",
          "pin": null,
        },
        {
          "groupPath": [
            "a",
          ],
          "groupVisibility": "visible-when-open",
          "id": "y2",
          "pin": null,
        },
        {
          "groupPath": [
            "a",
            "b",
          ],
          "groupVisibility": "always-visible",
          "id": "z1",
          "pin": "end",
        },
      ]
    `);
  });
});

describe("Performance Edge Cases", () => {
  test("should handle large number of columns", () => {
    const columns: ColumnLike[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `col${i}`,
      groupPath: [`group${Math.floor(i / 10)}`],
      groupVisibility: "visible-when-open" as const,
    }));

    expect(columnsGroupVisibility(columns, () => false, "/").length).toBe(1000);
  });

  test("should handle deep group nesting", () => {
    const columns: ColumnLike[] = Array.from({ length: 10 }, (_, i) => ({
      id: `col${i}`,
      groupPath: Array.from({ length: 10 }, (_, j) => `group${j}`),
      groupVisibility: "visible-when-open" as const,
    }));

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:group0|>empty-0",
          "pin": undefined,
        },
      ]
    `);
  });
});

describe("Special Column States", () => {
  test("should handle dynamic group membership", () => {
    const columns: ColumnLike[] = [
      { id: "x", groupPath: ["a", "b"] },
      { id: "y", groupPath: ["a"] },
      { id: "z" },
    ];

    // First test with no groups collapsed
    expect(columnsGroupVisibility(columns, () => false, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
            "b",
          ],
          "id": "x",
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "y",
        },
        {
          "id": "z",
        },
      ]
    `);

    // Then test with nested group collapsed
    expect(columnsGroupVisibility(columns, (path) => path === "a/b", "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "a",
          ],
          "id": "lytenyte-empty:a|>b|>empty-0",
          "pin": undefined,
        },
        {
          "groupPath": [
            "a",
          ],
          "id": "y",
        },
        {
          "id": "z",
        },
      ]
    `);

    // Finally test with parent group collapsed
    expect(columnsGroupVisibility(columns, (path) => path === "a", "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": undefined,
        },
        {
          "id": "z",
        },
      ]
    `);
  });

  test("should handle groups split across pin boundaries", () => {
    const columns: ColumnLike[] = [
      { id: "x1", groupPath: ["a"], pin: "start" },
      { id: "x2", groupPath: ["a"], pin: "start" },
      { id: "y1", groupPath: ["a"], pin: null },
      { id: "y2", groupPath: ["a"], pin: null },
      { id: "z1", groupPath: ["a"], pin: "end" },
      { id: "z2", groupPath: ["a"], pin: "end" },
    ];

    expect(columnsGroupVisibility(columns, () => true, "/")).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptystart-0",
          "pin": "start",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>empty-0",
          "pin": null,
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:a|>emptyend-0",
          "pin": "end",
        },
      ]
    `);
  });
});

describe("Empty Column Adjacent Checks", () => {
  test("should handle empty column next to ungrouped column", () => {
    const columns: ColumnLike[] = [
      { id: "ungrouped" }, // Column with no groupPath
      {
        id: "grouped",
        groupPath: ["group1"],
        groupVisibility: "visible-when-open",
      },
    ];

    // Make the grouped column collapse into an empty column
    const result = columnsGroupVisibility(columns, () => true, "/");

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "id": "ungrouped",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:group1|>empty-0",
          "pin": undefined,
        },
      ]
    `);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "ungrouped" });
    expect(result[1].id).toContain("empty"); // The second column should be an empty placeholder
  });

  test("should handle empty column between ungrouped columns", () => {
    const columns: ColumnLike[] = [
      { id: "ungrouped1" }, // No groupPath
      {
        id: "grouped",
        groupPath: ["group1"],
        groupVisibility: "visible-when-open",
      },
      { id: "ungrouped2" }, // No groupPath
    ];

    // Make the grouped column collapse into an empty column
    const result = columnsGroupVisibility(columns, () => true, "/");

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "id": "ungrouped1",
        },
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:group1|>empty-0",
          "pin": undefined,
        },
        {
          "id": "ungrouped2",
        },
      ]
    `);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ id: "ungrouped1" });
    expect(result[1].id).toContain("empty"); // Middle column should be an empty placeholder
    expect(result[2]).toEqual({ id: "ungrouped2" });
  });
});
