import { columnEmptyKey } from "../column-empty-key.js";
import { columnGroups } from "../column-groups.js";
import type { ColumnLike } from "../columns-visible/columns-visible.js";
import { formatLevels } from "./format-levels.js";

test("should return the correct structure when there are no columns", () => {
  const columns: ColumnLike[] = [];

  expect(columnGroups(columns, "_")).toMatchInlineSnapshot(`
    {
      "allLevels": [],
      "centerLevels": [],
      "endLevels": [],
      "startLevels": [],
    }
  `);
});

test("should be able to handle mixed columns and non-columns", () => {
  const columns: ColumnLike[] = [
    { id: "x", groupPath: ["a"] },
    { id: columnEmptyKey(["b"], null) },
    { id: "y" },
    { id: "v", groupPath: ["a"] },
  ];

  expect(formatLevels(columnGroups(columns, "_").allLevels)).toMatchInlineSnapshot(`
    "
    a/a-0/(0, 1) | ~ | ~ | a/a-1/(3, 4)
    "
  `);
});

test("should be able to handle nested levels", () => {
  const columns: ColumnLike[] = [
    { id: "x", groupPath: ["b", "x"] },
    { id: "z", groupPath: ["b", "x"] },
    { id: columnEmptyKey(["b"], null) },
    { id: "y" },
    { id: "v", groupPath: ["a"] },
  ];

  expect(formatLevels(columnGroups(columns, "_").allLevels)).toMatchInlineSnapshot(`
    "
    b/b-0/(0, 2)   | b/b-0/(0, 2)   | ~ | ~ | a/a-0/(4, 5)
    x/b_x-0/(0, 2) | x/b_x-0/(0, 2) | ~ | ~ | ~           
    "
  `);
});

test("should return the correct structure when there are no groups", () => {
  const columns: ColumnLike[] = [{ id: "x" }, { id: "y" }, { id: "z" }, { id: "z" }, { id: "v" }];
  expect(columnGroups(columns, "_")).toMatchInlineSnapshot(`
    {
      "allLevels": [],
      "centerLevels": [],
      "endLevels": [],
      "startLevels": [],
    }
  `);

  expect(columnGroups(columns, "_")).toMatchInlineSnapshot(`
    {
      "allLevels": [],
      "centerLevels": [],
      "endLevels": [],
      "startLevels": [],
    }
  `);
});

test("should return the correct group structure for a single group", () => {
  const columns: ColumnLike[] = [{ id: "X", groupPath: ["X", "Y", "Z"] }];

  const result = columnGroups(columns, "_");

  expect(formatLevels(result.allLevels)).toMatchInlineSnapshot(`
    "
    X/X-0/(0, 1)    
    Y/X_Y-0/(0, 1)  
    Z/X_Y_Z-0/(0, 1)
    "
  `);
  expect(formatLevels(result.centerLevels)).toMatchInlineSnapshot(`
    "
    X/X-0/(0, 1)    
    Y/X_Y-0/(0, 1)  
    Z/X_Y_Z-0/(0, 1)
    "
  `);
  expect([formatLevels(result.startLevels), formatLevels(result.endLevels)]).toMatchInlineSnapshot(`
    [
      "



    ",
      "



    ",
    ]
  `);
});
