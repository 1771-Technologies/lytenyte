import { COLUMN_MARKER_ID, GROUP_COLUMN_PREFIX } from "@1771technologies/grid-constants";
import { columnsVisibleCalc, type ColumnLike } from "../columns-visible.js";

describe("columnsVisible", () => {
  const delimiter = "/";
  const isGroupCollapsed = () => false;

  test("should handle empty array", () => {
    expect(
      columnsVisibleCalc([], { hide: false }, isGroupCollapsed, delimiter),
    ).toMatchInlineSnapshot(`[]`);
  });

  test("should filter out hidden columns", () => {
    const columns: ColumnLike[] = [{ id: "1", hide: true }, { id: "2", hide: false }, { id: "3" }];

    const result = columnsVisibleCalc(columns, { hide: false }, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "hide": false,
          "id": "2",
        },
        {
          "id": "3",
        },
      ]
    `);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(["2", "3"]);
  });

  test("should use base hide property when column hide is undefined", () => {
    const columns: ColumnLike[] = [{ id: "1" }, { id: "2" }, { id: "3" }];

    const result = columnsVisibleCalc(columns, { hide: true }, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`[]`);
  });

  test("should handle columns with groups", () => {
    const columns: ColumnLike[] = [
      { id: "1", hide: false, groupPath: ["group1"] },
      { id: "2", hide: true, groupPath: ["group1"] },
      { id: "3", groupPath: ["group1"] },
    ];

    const result = columnsVisibleCalc(columns, { hide: false }, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "group1",
          ],
          "hide": false,
          "id": "1",
        },
        {
          "groupPath": [
            "group1",
          ],
          "id": "3",
        },
      ]
    `);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(["1", "3"]);
  });

  test("should preserve other column properties", () => {
    const columns: ColumnLike[] = [
      {
        id: "1",
        hide: false,
        groupPath: ["group1"],
        groupVisibility: "always-visible",
        pin: "start",
      },
      {
        id: "2",
        hide: true,
        groupPath: ["group1"],
        groupVisibility: "visible-when-open",
        pin: "end",
      },
    ];

    const result = columnsVisibleCalc(columns, { hide: false }, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "groupPath": [
            "group1",
          ],
          "groupVisibility": "always-visible",
          "hide": false,
          "id": "1",
          "pin": "start",
        },
      ]
    `);
    expect(result[0]).toMatchObject({
      id: "1",
      groupPath: ["group1"],
      groupVisibility: "always-visible",
      pin: "start",
    });
  });

  test("should handle mixed base properties", () => {
    const columns: ColumnLike[] = [{ id: "1" }, { id: "2", hide: false }, { id: "3", hide: true }];

    const base = {
      hide: true,
      groupPath: ["default-group"],
      groupVisibility: "visible-when-open" as const,
      pin: "start" as const,
    };

    const result = columnsVisibleCalc(columns, base, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "hide": false,
          "id": "2",
        },
      ]
    `);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  test("should handle column hide overriding base hide", () => {
    const columns: ColumnLike[] = [
      { id: "1", hide: false },
      { id: "2", hide: true },
      { id: "3", hide: false },
    ];

    const result = columnsVisibleCalc(columns, { hide: true }, isGroupCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "hide": false,
          "id": "1",
        },
        {
          "hide": false,
          "id": "3",
        },
      ]
    `);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(["1", "3"]);
  });

  test("should work with group collapse states", () => {
    const columns: ColumnLike[] = [
      { id: "1", hide: false, groupPath: ["group1"] },
      { id: "2", groupPath: ["group1"] },
      { id: "3", hide: true, groupPath: ["group1"] },
    ];

    const isCollapsed = (id: string) => id === "group1";
    const result = columnsVisibleCalc(columns, { hide: false }, isCollapsed, delimiter);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "groupPath": undefined,
          "id": "lytenyte-empty:group1|>empty-0",
          "pin": undefined,
        },
      ]
    `);
    // Further assertions based on expected group collapse behavior
  });
});

describe("Special Column Filtering", () => {
  test("should return empty array when only marker and group columns remain", () => {
    const columns: ColumnLike[] = [
      { id: COLUMN_MARKER_ID },
      { id: `${GROUP_COLUMN_PREFIX}group1` },
      { id: "regular-column", hide: true },
      { id: "another-column", hide: true },
    ];

    const result = columnsVisibleCalc(columns, { hide: false }, () => false, "/");

    expect(result).toEqual([]);
  });

  test("should keep columns when at least one regular column is visible", () => {
    const columns: ColumnLike[] = [
      { id: COLUMN_MARKER_ID },
      { id: `${GROUP_COLUMN_PREFIX}group1` },
      { id: "regular-column", hide: false },
      { id: "hidden-column", hide: true },
    ];

    const result = columnsVisibleCalc(columns, { hide: false }, () => false, "/");

    expect(result).toHaveLength(3); // Marker, group, and regular column
    expect(result.some((c) => c.id === "regular-column")).toBe(true);
    expect(result.some((c) => c.id === COLUMN_MARKER_ID)).toBe(true);
    expect(result.some((c) => c.id.startsWith(GROUP_COLUMN_PREFIX))).toBe(true);
  });

  test("should handle case with only special columns in input", () => {
    const columns: ColumnLike[] = [
      { id: COLUMN_MARKER_ID },
      { id: `${GROUP_COLUMN_PREFIX}group1` },
      { id: `${GROUP_COLUMN_PREFIX}group2` },
    ];

    const result = columnsVisibleCalc(columns, { hide: false }, () => false, "/");

    expect(result).toEqual([]);
  });
});
